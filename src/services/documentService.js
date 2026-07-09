/**
 * Document Management Service with Upload, Processing, and Security
 * Features: File upload, validation, virus scanning, OCR, digital signatures
 */

const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

class DocumentService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt'];
        this.documents = new Map();
        this.processingQueue = [];

        this.initializeUploadDir();
    }

    /**
     * Initialize upload directory
     */
    async initializeUploadDir() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
            await fs.mkdir(path.join(this.uploadDir, 'temp'), { recursive: true });
            await fs.mkdir(path.join(this.uploadDir, 'processed'), { recursive: true });
            await fs.mkdir(path.join(this.uploadDir, 'quarantine'), { recursive: true });
            console.log('📁 Document service initialized');
        } catch (error) {
            console.error('Failed to initialize upload directory:', error);
        }
    }

    /**
     * Configure multer for file uploads
     */
    getMulterConfig() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(this.uploadDir, 'temp'));
            },
            filename: (req, file, cb) => {
                const uniqueId = crypto.randomUUID();
                const sanitizedName = this.sanitizeFilename(file.originalname);
                const extension = path.extname(sanitizedName);
                cb(null, `${uniqueId}${extension}`);
            }
        });

        const fileFilter = (req, file, cb) => {
            // Check MIME type
            if (!this.allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error('File type not allowed'), false);
            }

            // Check file extension
            const extension = path.extname(file.originalname).toLowerCase();
            if (!this.allowedExtensions.includes(extension)) {
                return cb(new Error('File extension not allowed'), false);
            }

            cb(null, true);
        };

        return multer({
            storage,
            fileFilter,
            limits: {
                fileSize: this.maxFileSize,
                files: 5 // Max 5 files per upload
            }
        });
    }

    /**
     * Process document upload from Telegram
     */
    async processTelegramDocument(bot, fileId, userId, applicationId, documentType) {
        try {
            console.log(`📄 Processing document: ${fileId} for user ${userId}`);

            // Get file info from Telegram
            const fileLink = await bot.getFileLink(fileId);
            const fileInfo = await bot.getFile(fileId);

            // Download file
            const response = await fetch(fileLink);
            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);

            // Validate file
            const validation = await this.validateFile(uint8Array, fileInfo.file_path);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Generate document metadata
            const documentId = this.generateDocumentId();
            const filename = this.sanitizeFilename(fileInfo.file_path);
            const extension = path.extname(filename);
            const tempPath = path.join(this.uploadDir, 'temp', `${documentId}${extension}`);

            // Save to temporary location
            await fs.writeFile(tempPath, uint8Array);

            // Create document record
            const document = {
                id: documentId,
                originalName: filename,
                fileId,
                userId,
                applicationId,
                documentType,
                mimeType: validation.mimeType,
                size: uint8Array.length,
                checksum: this.calculateChecksum(uint8Array),
                status: 'uploaded',
                uploadedAt: new Date(),
                tempPath,
                processedPath: null,
                metadata: {
                    source: 'telegram',
                    originalFileInfo: fileInfo
                }
            };

            this.documents.set(documentId, document);

            // Add to processing queue
            this.processingQueue.push(documentId);
            this.processQueue();

            return {
                success: true,
                documentId,
                status: 'uploaded',
                message: 'Document uploaded successfully and is being processed'
            };

        } catch (error) {
            console.error('Document processing failed:', error);
            return {
                success: false,
                error: error.message,
                errorCode: 'DOCUMENT_UPLOAD_FAILED'
            };
        }
    }

    /**
     * Process document upload queue
     */
    async processQueue() {
        if (this.processingQueue.length === 0) {
            return;
        }

        const documentId = this.processingQueue.shift();
        const document = this.documents.get(documentId);

        if (!document) {
            return;
        }

        try {
            document.status = 'processing';
            console.log(`🔄 Processing document: ${documentId}`);

            // Step 1: Virus scan
            const virusCheck = await this.scanForViruses(document.tempPath);
            if (!virusCheck.clean) {
                await this.quarantineDocument(document, 'Virus detected');
                return;
            }

            // Step 2: Advanced validation
            const deepValidation = await this.performDeepValidation(document);
            if (!deepValidation.valid) {
                await this.quarantineDocument(document, deepValidation.reason);
                return;
            }

            // Step 3: Extract metadata
            const metadata = await this.extractMetadata(document);
            document.metadata = { ...document.metadata, ...metadata };

            // Step 4: OCR for text extraction (if applicable)
            if (this.isImageDocument(document)) {
                const ocrResult = await this.performOCR(document);
                document.extractedText = ocrResult.text;
                document.confidence = ocrResult.confidence;
            }

            // Step 5: Generate thumbnails (if image)
            if (this.isImageDocument(document)) {
                const thumbnail = await this.generateThumbnail(document);
                document.thumbnailPath = thumbnail.path;
            }

            // Step 6: Move to processed directory
            const processedPath = path.join(
                this.uploadDir,
                'processed',
                `${document.id}${path.extname(document.originalName)}`
            );

            await fs.rename(document.tempPath, processedPath);
            document.processedPath = processedPath;
            document.tempPath = null;
            document.status = 'processed';
            document.processedAt = new Date();

            // Step 7: Upload to government API
            const uploadResult = await this.uploadToGovernmentAPI(document);
            if (uploadResult.success) {
                document.governmentDocumentId = uploadResult.documentId;
                document.status = 'submitted';
            }

            console.log(`✅ Document processed successfully: ${documentId}`);

            // Continue processing queue
            setTimeout(() => this.processQueue(), 1000);

        } catch (error) {
            console.error(`❌ Document processing failed: ${documentId}`, error);
            document.status = 'failed';
            document.error = error.message;
        }
    }

    /**
     * Validate uploaded file
     */
    async validateFile(buffer, filename) {
        try {
            // Check file size
            if (buffer.length > this.maxFileSize) {
                return { valid: false, error: 'File size exceeds limit' };
            }

            // Check file extension
            const extension = path.extname(filename).toLowerCase();
            if (!this.allowedExtensions.includes(extension)) {
                return { valid: false, error: 'File type not allowed' };
            }

            // Detect MIME type from file signature
            const mimeType = this.detectMimeType(buffer);
            if (!this.allowedMimeTypes.includes(mimeType)) {
                return { valid: false, error: 'File content does not match extension' };
            }

            // Check for embedded executables
            if (this.containsExecutableCode(buffer)) {
                return { valid: false, error: 'File contains potentially malicious content' };
            }

            return { valid: true, mimeType };

        } catch (error) {
            return { valid: false, error: 'File validation failed' };
        }
    }

    /**
     * Scan file for viruses using ClamAV
     */
    async scanForViruses(filePath) {
        try {
            // In production, this would use ClamAV or similar
            const { stdout, stderr } = await execAsync(`clamscan --no-summary "${filePath}"`);

            if (stderr) {
                console.warn('Virus scan warning:', stderr);
            }

            const isClean = !stdout.includes('FOUND');

            return {
                clean: isClean,
                result: stdout.trim(),
                scanTime: new Date()
            };

        } catch (error) {
            // If ClamAV is not available, perform basic checks
            console.warn('ClamAV not available, performing basic checks');
            return this.performBasicMalwareCheck(filePath);
        }
    }

    /**
     * Basic malware detection without ClamAV
     */
    async performBasicMalwareCheck(filePath) {
        try {
            const buffer = await fs.readFile(filePath);

            // Check for common malware signatures
            const malwareSignatures = [
                Buffer.from([0x4D, 0x5A]), // PE executable
                Buffer.from('<?php'),      // PHP code
                Buffer.from('<script'),    // JavaScript
                Buffer.from('eval('),      // Code injection
                Buffer.from('exec('),      // Code execution
            ];

            for (const signature of malwareSignatures) {
                if (buffer.includes(signature)) {
                    return {
                        clean: false,
                        result: 'Potentially malicious content detected',
                        scanTime: new Date()
                    };
                }
            }

            return {
                clean: true,
                result: 'Basic scan passed',
                scanTime: new Date()
            };

        } catch (error) {
            return {
                clean: false,
                result: 'Scan failed',
                scanTime: new Date()
            };
        }
    }

    /**
     * Perform deep document validation
     */
    async performDeepValidation(document) {
        try {
            const buffer = await fs.readFile(document.tempPath);

            // PDF-specific validation
            if (document.mimeType === 'application/pdf') {
                return this.validatePDF(buffer);
            }

            // Image-specific validation
            if (document.mimeType.startsWith('image/')) {
                return this.validateImage(buffer);
            }

            // Document-specific validation
            if (document.mimeType.includes('document')) {
                return this.validateDocument(buffer);
            }

            return { valid: true };

        } catch (error) {
            return {
                valid: false,
                reason: `Deep validation failed: ${error.message}`
            };
        }
    }

    /**
     * Extract document metadata
     */
    async extractMetadata(document) {
        try {
            const stats = await fs.stat(document.tempPath);

            const metadata = {
                fileSize: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                permissions: stats.mode.toString(8),
            };

            // Extract EXIF data for images
            if (this.isImageDocument(document)) {
                metadata.imageMetadata = await this.extractImageMetadata(document.tempPath);
            }

            // Extract PDF metadata
            if (document.mimeType === 'application/pdf') {
                metadata.pdfMetadata = await this.extractPDFMetadata(document.tempPath);
            }

            return metadata;

        } catch (error) {
            console.error('Metadata extraction failed:', error);
            return {};
        }
    }

    /**
     * Perform OCR on document images
     */
    async performOCR(document) {
        try {
            // Using Tesseract OCR (would need to be installed)
            const { stdout } = await execAsync(`tesseract "${document.tempPath}" stdout -l eng+amh`);

            const text = stdout.trim();
            const confidence = this.calculateOCRConfidence(text);

            return {
                text,
                confidence,
                language: 'eng+amh',
                timestamp: new Date()
            };

        } catch (error) {
            console.warn('OCR processing failed:', error);
            return {
                text: '',
                confidence: 0,
                error: error.message
            };
        }
    }

    /**
     * Generate thumbnail for images
     */
    async generateThumbnail(document) {
        try {
            const thumbnailDir = path.join(this.uploadDir, 'thumbnails');
            await fs.mkdir(thumbnailDir, { recursive: true });

            const thumbnailPath = path.join(thumbnailDir, `${document.id}_thumb.jpg`);

            // Using ImageMagick (would need to be installed)
            await execAsync(`convert "${document.tempPath}" -thumbnail 200x200 "${thumbnailPath}"`);

            return {
                path: thumbnailPath,
                size: '200x200',
                format: 'jpeg'
            };

        } catch (error) {
            console.warn('Thumbnail generation failed:', error);
            return null;
        }
    }

    /**
     * Upload document to government API
     */
    async uploadToGovernmentAPI(document) {
        try {
            const governmentApi = require('./governmentApi');

            const buffer = await fs.readFile(document.processedPath);

            const result = await governmentApi.uploadDocument({
                buffer,
                filename: document.originalName,
                type: document.documentType,
                applicationId: document.applicationId,
                uploaderId: document.userId,
                checksum: document.checksum,
                metadata: document.metadata
            });

            return result;

        } catch (error) {
            console.error('Government API upload failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Quarantine suspicious document
     */
    async quarantineDocument(document, reason) {
        try {
            const quarantinePath = path.join(
                this.uploadDir,
                'quarantine',
                `${document.id}_${Date.now()}${path.extname(document.originalName)}`
            );

            if (document.tempPath && await fs.access(document.tempPath).then(() => true).catch(() => false)) {
                await fs.rename(document.tempPath, quarantinePath);
            }

            document.status = 'quarantined';
            document.quarantineReason = reason;
            document.quarantinePath = quarantinePath;
            document.quarantinedAt = new Date();

            console.log(`🚨 Document quarantined: ${document.id} - ${reason}`);

            // Log security event
            const security = require('../middleware/security');
            security.logSecurityEvent({
                type: 'DOCUMENT_QUARANTINED',
                documentId: document.id,
                userId: document.userId,
                reason,
                severity: 'high'
            });

        } catch (error) {
            console.error('Failed to quarantine document:', error);
        }
    }

    /**
     * Utility methods
     */

    sanitizeFilename(filename) {
        return filename
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 255);
    }

    generateDocumentId() {
        return `DOC-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }

    calculateChecksum(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }

    detectMimeType(buffer) {
        // Simple MIME type detection based on file signatures
        const signatures = {
            'image/jpeg': [0xFF, 0xD8, 0xFF],
            'image/png': [0x89, 0x50, 0x4E, 0x47],
            'image/gif': [0x47, 0x49, 0x46, 0x38],
            'application/pdf': [0x25, 0x50, 0x44, 0x46],
            'application/zip': [0x50, 0x4B, 0x03, 0x04],
        };

        for (const [mimeType, signature] of Object.entries(signatures)) {
            if (buffer.length >= signature.length) {
                const match = signature.every((byte, index) => buffer[index] === byte);
                if (match) return mimeType;
            }
        }

        return 'application/octet-stream';
    }

    containsExecutableCode(buffer) {
        // Check for executable signatures
        const executableSignatures = [
            [0x4D, 0x5A], // PE executable
            [0x7F, 0x45, 0x4C, 0x46], // ELF
            [0xCF, 0xFA, 0xED, 0xFE], // Mach-O
        ];

        return executableSignatures.some(signature =>
            buffer.length >= signature.length &&
            signature.every((byte, index) => buffer[index] === byte)
        );
    }

    isImageDocument(document) {
        return document.mimeType.startsWith('image/');
    }

    calculateOCRConfidence(text) {
        // Simple confidence calculation based on text characteristics
        if (!text || text.length === 0) return 0;

        const words = text.split(/\s+/).filter(word => word.length > 0);
        const validWords = words.filter(word => /^[a-zA-Z\u1200-\u137F]+$/.test(word));

        return Math.round((validWords.length / words.length) * 100);
    }

    /**
     * Get document status
     */
    getDocumentStatus(documentId) {
        const document = this.documents.get(documentId);
        if (!document) {
            return { found: false };
        }

        return {
            found: true,
            id: document.id,
            status: document.status,
            uploadedAt: document.uploadedAt,
            processedAt: document.processedAt,
            size: document.size,
            type: document.documentType,
            error: document.error
        };
    }

    /**
     * Get user documents
     */
    getUserDocuments(userId) {
        return Array.from(this.documents.values())
            .filter(doc => doc.userId === userId)
            .map(doc => ({
                id: doc.id,
                originalName: doc.originalName,
                documentType: doc.documentType,
                status: doc.status,
                uploadedAt: doc.uploadedAt,
                size: doc.size
            }));
    }

    /**
     * Delete document (GDPR compliance)
     */
    async deleteDocument(documentId, reason = 'User request') {
        try {
            const document = this.documents.get(documentId);
            if (!document) {
                return { success: false, error: 'Document not found' };
            }

            // Delete physical files
            const filesToDelete = [
                document.tempPath,
                document.processedPath,
                document.thumbnailPath,
                document.quarantinePath
            ].filter(Boolean);

            for (const filePath of filesToDelete) {
                try {
                    await fs.unlink(filePath);
                } catch (error) {
                    console.warn(`Failed to delete file: ${filePath}`, error);
                }
            }

            // Remove from memory
            this.documents.delete(documentId);

            // Log deletion for audit
            const security = require('../middleware/security');
            security.logSecurityEvent({
                type: 'DOCUMENT_DELETED',
                documentId,
                userId: document.userId,
                reason,
                timestamp: new Date(),
                compliance: 'GDPR_Article_17'
            });

            return { success: true, deletedAt: new Date() };

        } catch (error) {
            console.error('Document deletion failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cleanup old documents
     */
    async cleanup() {
        try {
            const now = Date.now();
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

            for (const [documentId, document] of this.documents) {
                const age = now - document.uploadedAt.getTime();

                if (age > maxAge && document.status === 'processed') {
                    await this.deleteDocument(documentId, 'Automatic cleanup');
                }
            }

            console.log('📁 Document cleanup completed');

        } catch (error) {
            console.error('Document cleanup failed:', error);
        }
    }
}

module.exports = new DocumentService();