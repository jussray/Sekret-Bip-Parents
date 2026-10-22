// Screen composition only. Reusable parent feature behavior lives in /features.
// Do not put child-data fetching, account gates, or feature state in this entrypoint.
import { mountConversationKits } from './features/conversation-kits.js';
import { mountParentReflections } from './features/parent-reflections.js';

mountConversationKits();
mountParentReflections();
