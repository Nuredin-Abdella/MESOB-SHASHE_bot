/**
 * Application Submission Service
 * Handles the workflow for submitting service applications
 */

const database = require('../database/db');
const documentService = require('./documentService');

class ApplicationService {
    constructor() {
        // Track user application states
        this.userStates = new Map();
    }

    /**
     * Start new application for user
     */
    startApplication(chatId, userLang) {
        this.userStates.set(chatId, {
            step: 'select_service',
            service: null,
            documents: [],
            createdAt: new Date()
        });

        return {
            success: true,
            message: 'Application started. Please select a service.'
        };
    }

    /**
     * Set selected service
     */
    setService(chatId, service) {
        const state = this.userStates.get(chatId);
        if (!state) {
            return { success: false, error: 'No active application' };
        }

        state.service = service;
        state.step = 'upload_documents';

        return { success: true, service };
    }

    /**
     * Add document to application
     */
    addDocument(chatId, documentId, filename) {
        const state = this.userStates.get(chatId);
        if (!state) {
            return { success: false, error: 'No active application' };
        }

        if (state.documents.length >= 5) {
            return { success: false, error: 'Maximum 5 documents allowed' };
        }

        state.documents.push({ documentId, filename });
        return { success: true, count: state.documents.length };
    }

    /**
     * Submit application
     */
    async submitApplication(chatId, bot) {
        const state = this.userStates.get(chatId);
        if (!state) {
            return { success: false, error: 'No active application' };
        }

        if (!state.service) {
            return { success: false, error: 'No service selected' };
        }

        if (state.documents.length === 0) {
            return { success: false, error: 'No documents uploaded' };
        }

        try {
            // Create application in database
            const trackingNumber = await database.createApplication({
                chatId,
                service: state.service,
                documents: state.documents,
                status: 'submitted'
            });

            // Update documents with application ID
            for (const doc of state.documents) {
                const document = documentService.documents.get(doc.documentId);
                if (document) {
                    document.applicationId = trackingNumber;
                }
            }

            // Clear user state
            this.userStates.delete(chatId);

            return {
                success: true,
                trackingNumber,
                service: state.service,
                documentCount: state.documents.length
            };

        } catch (error) {
            console.error('Application submission failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cancel application
     */
    cancelApplication(chatId) {
        this.userStates.delete(chatId);
        return { success: true };
    }

    /**
     * Get current application state
     */
    getApplicationState(chatId) {
        return this.userStates.get(chatId);
    }

    /**
     * Check if user has active application
     */
    hasActiveApplication(chatId) {
        return this.userStates.has(chatId);
    }
}

module.exports = new ApplicationService();
