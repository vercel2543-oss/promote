import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
  User,
  CommitteeGroup,
  FormTemplate,
  EvaluationSubmission,
  SystemSettings,
  AuditLog,
} from '../types';

// Collection References
const USERS_COLLECTION = 'users';
const GROUPS_COLLECTION = 'committeeGroups';
const TEMPLATES_COLLECTION = 'formTemplates';
const SUBMISSIONS_COLLECTION = 'submissions';
const SETTINGS_COLLECTION = 'systemSettings';
const LOGS_COLLECTION = 'auditLogs';

export const FirebaseService = {
  // ----------------------------------------------------
  // System Settings
  // ----------------------------------------------------
  async getSystemSettings(): Promise<SystemSettings | null> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'current');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SystemSettings;
      }
      return null;
    } catch (error) {
      console.error('Error getting system settings from Firebase:', error);
      return null;
    }
  },

  async saveSystemSettings(settings: SystemSettings): Promise<void> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'current');
      await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (error) {
      console.error('Error saving system settings to Firebase:', error);
      throw error;
    }
  },

  listenSystemSettings(callback: (settings: SystemSettings | null) => void) {
    const docRef = doc(db, SETTINGS_COLLECTION, 'current');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as SystemSettings);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to system settings:', error);
      }
    );
  },

  // ----------------------------------------------------
  // Users (Evaluators, Evaluatees, Admins)
  // ----------------------------------------------------
  async getUsers(): Promise<User[]> {
    try {
      const snapshot = await getDocs(collection(db, USERS_COLLECTION));
      return snapshot.docs.map((d) => d.data() as User);
    } catch (error) {
      console.error('Error fetching users from Firebase:', error);
      return [];
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, user.id);
      await setDoc(docRef, user, { merge: true });
    } catch (error) {
      console.error('Error saving user to Firebase:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, userId));
    } catch (error) {
      console.error('Error deleting user from Firebase:', error);
      throw error;
    }
  },

  listenUsers(callback: (users: User[]) => void) {
    return onSnapshot(
      collection(db, USERS_COLLECTION),
      (snapshot) => {
        const users = snapshot.docs.map((d) => d.data() as User);
        callback(users);
      },
      (error) => {
        console.error('Error listening to users:', error);
      }
    );
  },

  // ----------------------------------------------------
  // Committee Groups
  // ----------------------------------------------------
  async getCommitteeGroups(): Promise<CommitteeGroup[]> {
    try {
      const snapshot = await getDocs(collection(db, GROUPS_COLLECTION));
      return snapshot.docs.map((d) => d.data() as CommitteeGroup);
    } catch (error) {
      console.error('Error fetching groups from Firebase:', error);
      return [];
    }
  },

  async saveCommitteeGroup(group: CommitteeGroup): Promise<void> {
    try {
      const docRef = doc(db, GROUPS_COLLECTION, group.id);
      await setDoc(docRef, group, { merge: true });
    } catch (error) {
      console.error('Error saving group to Firebase:', error);
      throw error;
    }
  },

  async deleteCommitteeGroup(groupId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, GROUPS_COLLECTION, groupId));
    } catch (error) {
      console.error('Error deleting group from Firebase:', error);
      throw error;
    }
  },

  listenCommitteeGroups(callback: (groups: CommitteeGroup[]) => void) {
    return onSnapshot(
      collection(db, GROUPS_COLLECTION),
      (snapshot) => {
        const groups = snapshot.docs.map((d) => d.data() as CommitteeGroup);
        callback(groups);
      },
      (error) => {
        console.error('Error listening to groups:', error);
      }
    );
  },

  // ----------------------------------------------------
  // Form Templates
  // ----------------------------------------------------
  async getFormTemplates(): Promise<FormTemplate[]> {
    try {
      const snapshot = await getDocs(collection(db, TEMPLATES_COLLECTION));
      return snapshot.docs.map((d) => d.data() as FormTemplate);
    } catch (error) {
      console.error('Error fetching templates from Firebase:', error);
      return [];
    }
  },

  async saveFormTemplate(template: FormTemplate): Promise<void> {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, template.id);
      await setDoc(docRef, template, { merge: true });
    } catch (error) {
      console.error('Error saving template to Firebase:', error);
      throw error;
    }
  },

  async deleteFormTemplate(templateId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, TEMPLATES_COLLECTION, templateId));
    } catch (error) {
      console.error('Error deleting template from Firebase:', error);
      throw error;
    }
  },

  listenFormTemplates(callback: (templates: FormTemplate[]) => void) {
    return onSnapshot(
      collection(db, TEMPLATES_COLLECTION),
      (snapshot) => {
        const templates = snapshot.docs.map((d) => d.data() as FormTemplate);
        callback(templates);
      },
      (error) => {
        console.error('Error listening to templates:', error);
      }
    );
  },

  // ----------------------------------------------------
  // Submissions (Evaluations & Drafts)
  // ----------------------------------------------------
  async getSubmissions(): Promise<EvaluationSubmission[]> {
    try {
      const snapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
      return snapshot.docs.map((d) => d.data() as EvaluationSubmission);
    } catch (error) {
      console.error('Error fetching submissions from Firebase:', error);
      return [];
    }
  },

  async saveSubmission(submission: EvaluationSubmission): Promise<void> {
    try {
      const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
      await setDoc(docRef, submission, { merge: true });
    } catch (error) {
      console.error('Error saving submission to Firebase:', error);
      throw error;
    }
  },

  async deleteSubmission(submissionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId));
    } catch (error) {
      console.error('Error deleting submission from Firebase:', error);
      throw error;
    }
  },

  listenSubmissions(callback: (submissions: EvaluationSubmission[]) => void) {
    return onSnapshot(
      collection(db, SUBMISSIONS_COLLECTION),
      (snapshot) => {
        const subs = snapshot.docs.map((d) => d.data() as EvaluationSubmission);
        callback(subs);
      },
      (error) => {
        console.error('Error listening to submissions:', error);
      }
    );
  },

  // ----------------------------------------------------
  // Audit Logs
  // ----------------------------------------------------
  async addAuditLog(log: AuditLog): Promise<void> {
    try {
      const docRef = doc(db, LOGS_COLLECTION, log.id);
      await setDoc(docRef, log);
    } catch (error) {
      console.error('Error saving audit log to Firebase:', error);
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const snapshot = await getDocs(collection(db, LOGS_COLLECTION));
      return snapshot.docs.map((d) => d.data() as AuditLog);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  },

  // ----------------------------------------------------
  // Batch Seed Initial Data to Firebase
  // ----------------------------------------------------
  async seedInitialData(
    users: User[],
    groups: CommitteeGroup[],
    templates: FormTemplate[],
    submissions: EvaluationSubmission[],
    settings: SystemSettings
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      // 1. Settings
      const settingsRef = doc(db, SETTINGS_COLLECTION, 'current');
      batch.set(settingsRef, settings);

      // 2. Users
      users.forEach((user) => {
        const uRef = doc(db, USERS_COLLECTION, user.id);
        batch.set(uRef, user);
      });

      // 3. Groups
      groups.forEach((group) => {
        const gRef = doc(db, GROUPS_COLLECTION, group.id);
        batch.set(gRef, group);
      });

      // 4. Templates
      templates.forEach((tmpl) => {
        const tRef = doc(db, TEMPLATES_COLLECTION, tmpl.id);
        batch.set(tRef, tmpl);
      });

      // 5. Submissions
      submissions.forEach((sub) => {
        const sRef = doc(db, SUBMISSIONS_COLLECTION, sub.id);
        batch.set(sRef, sub);
      });

      await batch.commit();
      console.log('Firebase Firestore initialized and seeded successfully!');
    } catch (error) {
      console.error('Error seeding Firebase data:', error);
      throw error;
    }
  },
};
