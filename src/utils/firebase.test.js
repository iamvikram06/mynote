import {
  initFirebase,
  signUpWithEmail,
  signInWithEmail,
  signOut,
  fetchUserNotes,
  saveUserNote,
  deleteUserNote,
  saveUserNotesBulk,
} from './firebase';

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe('Firebase Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initFirebase', () => {
    it('should initialize Firebase with valid config', () => {
      const config = {
        apiKey: 'test-api-key',
        authDomain: 'test.firebaseapp.com',
        projectId: 'test-project',
      };

      const result = initFirebase(config);
      expect(result).toBeDefined();
    });

    it('should handle initialization errors gracefully', () => {
      const { initializeApp } = require('firebase/app');
      initializeApp.mockImplementation(() => {
        throw new Error('Init failed');
      });

      const result = initFirebase({});
      expect(result).toBeNull();
    });
  });

  describe('Authentication', () => {
    it('should throw error when Firebase not initialized', async () => {
      await expect(signUpWithEmail('test@example.com', 'password')).rejects.toThrow('Firebase not initialized');
      await expect(signInWithEmail('test@example.com', 'password')).rejects.toThrow('Firebase not initialized');
    });

    it('should handle authentication errors', async () => {
      // Mock Firebase as initialized
      const { getAuth } = require('firebase/auth');
      getAuth.mockReturnValue({});

      const { createUserWithEmailAndPassword } = require('firebase/auth');
      createUserWithEmailAndPassword.mockRejectedValue(new Error('Auth failed'));

      await expect(signUpWithEmail('test@example.com', 'password')).rejects.toThrow('Auth failed');
    });
  });

  describe('Note Operations', () => {
    it('should throw error when Firestore not initialized', async () => {
      await expect(fetchUserNotes('user123')).rejects.toThrow('Firestore not initialized');
      await expect(saveUserNote('user123', { id: 'note1' })).rejects.toThrow('Firestore not initialized');
      await expect(deleteUserNote('user123', 'note1')).rejects.toThrow('Firestore not initialized');
    });

    it('should validate required parameters', async () => {
      // Mock Firestore as initialized
      const { getFirestore } = require('firebase/firestore');
      getFirestore.mockReturnValue({});

      await expect(fetchUserNotes()).rejects.toThrow('User ID is required');
      await expect(saveUserNote('user123')).rejects.toThrow('Note with ID is required');
      await expect(saveUserNote('user123', {})).rejects.toThrow('Note with ID is required');
      await expect(deleteUserNote()).rejects.toThrow('User ID is required');
      await expect(deleteUserNote('user123')).rejects.toThrow('Note ID is required');
      await expect(saveUserNotesBulk('user123')).rejects.toThrow('Notes must be an array');
    });
  });
});
