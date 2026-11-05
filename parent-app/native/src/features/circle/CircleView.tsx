import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Canvas, Glass } from '../../components/Canvas';
import { palette } from '../../theme';
import {
  ParentCommunityUnavailableError,
  createParentCommunityPost,
  loadParentCommunityFeed,
  reactToParentCommunityPost,
  replyToParentCommunityPost,
  reportParentCommunityPost,
} from './repository';
import type { ParentCommunityPost, ParentCommunityReactionKey } from './types';

const REACTIONS: Array<{ key: ParentCommunityReactionKey; emoji: string; label: string }> = [
  { key: 'beenThere', emoji: '☕', label: 'been there' },
  { key: 'solidarity', emoji: '🤝', label: 'solidarity' },
  { key: 'reminder', emoji: '🌱', label: 'reminder' },
  { key: 'needed', emoji: '💜', label: 'needed this' },
  { key: 'strength', emoji: '🕯️', label: 'strength' },
];

function friendlyError(error: unknown): string {
  if (error instanceof ParentCommunityUnavailableError) {
    return 'Parent Circle V2 is not activated on the server yet. Nothing was posted, exposed, or replaced.';
  }
  return 'Parent Circle could not refresh safely. Try again after checking your connection and guardian verification.';
}

function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
}

export function CircleView() {
  const [posts, setPosts] = useState<ParentCommunityPost[]>([]);
  const [notice, setNotice] = useState<string>('Checking Parent Circle…');
  const [draft, setDraft] = useState('');
  const [tag, setTag] = useState('');
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [working, setWorking] = useState(false);

  const activated = useMemo(
    () => !notice.includes('not activated on the server yet'),
    [notice],
  );

  const refresh = useCallback(async () => {
    try {
      const next = await loadParentCommunityFeed();
      setPosts(next);
      setNotice(next.length ? '' : 'The Parent Circle is quiet right now. No sample posts are shown in production.');
    } catch (error) {
      setPosts([]);
      setNotice(friendlyError(error));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function createPost() {
    if (!draft.trim() || working) return;
    setWorking(true);
    try {
      const saved = await createParentCommunityPost(draft, tag);
      setPosts(current => [saved, ...current.filter(item => item.id !== saved.id)]);
      setDraft('');
      setTag('');
      setNotice('');
    } catch (error) {
      setNotice(friendlyError(error));
    } finally {
      setWorking(false);
    }
  }

  async function react(postId: string, reaction: ParentCommunityReactionKey) {
    try {
      const reactions = await reactToParentCommunityPost(postId, reaction);
      setPosts(current => current.map(post => post.id === postId ? { ...post, reactions } : post));
    } catch (error) {
      setNotice(friendlyError(error));
    }
  }

  async function sendQuietReply(postId: string) {
    if (!replyDraft.trim() || working) return;
    setWorking(true);
    try {
      const quietRepliesCount = await replyToParentCommunityPost(postId, replyDraft);
      setPosts(current => current.map(post => post.id === postId ? { ...post, quietRepliesCount } : post));
      setReplyDraft('');
      setReplyPostId(null);
    } catch (error) {
      setNotice(friendlyError(error));
    } finally {
      setWorking(false);
    }
  }

  function report(postId: string) {
    Alert.alert(
      'Report this post?',
      'This sends only the post ID and an optional moderation reason. It does not reveal another parent’s identity.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            void reportParentCommunityPost(postId)
              .then(() => setNotice('Report received. Thank you for helping keep Parent Circle safe.'))
              .catch(error => setNotice(friendlyError(error)));
          },
        },
      ],
    );
  }

  return (
    <Canvas
      eyebrow="Parent Circle"
      title="Support without comparison."
      detail="A guardian-only community built around anonymous support. No teen posts, journals, messages, or private child data appear here."
    >
      {notice ? (
        <Glass>
          <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text>
          <Pressable accessibilityRole="button" onPress={() => { void refresh(); }} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Check again</Text>
          </Pressable>
        </Glass>
      ) : null}

      <Glass>
        <Text style={styles.heading}>Share anonymously</Text>
        <TextInput
          accessibilityLabel="Parent Circle post"
          placeholder="What are you carrying today?"
          placeholderTextColor="#b4a8c6"
          multiline
          maxLength={2000}
          value={draft}
          onChangeText={setDraft}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel="Parent Circle topic tag"
          placeholder="Optional topic · communication, burnout, repair…"
          placeholderTextColor="#b4a8c6"
          maxLength={60}
          value={tag}
          onChangeText={setTag}
          style={styles.tagInput}
        />
        <Pressable
          accessibilityRole="button"
          disabled={!draft.trim() || working || !activated}
          onPress={() => { void createPost(); }}
          style={[styles.primaryButton, (!draft.trim() || working || !activated) && styles.disabled]}
        >
          <Text style={styles.primaryText}>{working ? 'Saving…' : 'Post to Parent Circle'}</Text>
        </Pressable>
      </Glass>

      {posts.map(post => (
        <Glass key={post.id}>
          <View style={styles.metaRow}>
            <Text style={styles.anon}>🌿 anonymous parent</Text>
            <Text style={styles.time}>{formatTime(post.createdAt)}</Text>
          </View>
          {post.circleTag ? <Text style={styles.tag}>{post.circleTag}</Text> : null}
          <Text style={styles.body}>{post.text}</Text>

          <View style={styles.reactionWrap}>
            {REACTIONS.map(item => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => { void react(post.id, item.key); }}
                style={styles.reaction}
              >
                <Text style={styles.reactionText}>{item.emoji} {post.reactions[item.key]} · {item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.replyCount}>{post.quietRepliesCount} quiet replies</Text>

          {replyPostId === post.id ? (
            <>
              <TextInput
                accessibilityLabel="Quiet reply"
                placeholder="A soft anonymous reply…"
                placeholderTextColor="#b4a8c6"
                multiline
                maxLength={2000}
                value={replyDraft}
                onChangeText={setReplyDraft}
                style={styles.input}
              />
              <Pressable
                accessibilityRole="button"
                disabled={!replyDraft.trim() || working}
                onPress={() => { void sendQuietReply(post.id); }}
                style={[styles.primaryButton, (!replyDraft.trim() || working) && styles.disabled]}
              >
                <Text style={styles.primaryText}>Send quietly</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => { setReplyPostId(post.id); setReplyDraft(''); }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryText}>Reply softly</Text>
            </Pressable>
          )}

          <Pressable accessibilityRole="button" onPress={() => report(post.id)} style={styles.reportButton}>
            <Text style={styles.reportText}>Report</Text>
          </Pressable>
        </Glass>
      ))}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  notice: { color: palette.muted, fontSize: 14, lineHeight: 22 },
  heading: { color: palette.text, fontSize: 19, fontWeight: '800', marginBottom: 12 },
  input: {
    minHeight: 110, borderWidth: 1, borderColor: palette.border, borderRadius: 14,
    backgroundColor: '#100c27', color: palette.text, padding: 14, fontSize: 15,
    lineHeight: 22, textAlignVertical: 'top', marginBottom: 10,
  },
  tagInput: {
    borderWidth: 1, borderColor: palette.border, borderRadius: 14,
    backgroundColor: '#100c27', color: palette.text, padding: 13, marginBottom: 12,
  },
  primaryButton: { backgroundColor: '#bfead1', borderRadius: 14, padding: 14, alignItems: 'center' },
  primaryText: { color: '#092117', fontWeight: '900' },
  secondaryButton: {
    borderWidth: 1, borderColor: palette.border, borderRadius: 14, padding: 12,
    alignItems: 'center', marginTop: 10,
  },
  secondaryText: { color: palette.glow, fontWeight: '800' },
  disabled: { opacity: 0.45 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  anon: { color: palette.glow, fontWeight: '800', fontSize: 12 },
  time: { color: palette.muted, fontSize: 11 },
  tag: { color: palette.pink, fontSize: 12, fontWeight: '700', marginBottom: 9 },
  body: { color: palette.text, fontSize: 16, lineHeight: 24, marginBottom: 13 },
  reactionWrap: { gap: 7 },
  reaction: {
    borderWidth: 1, borderColor: palette.border, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 9, backgroundColor: '#392957',
  },
  reactionText: { color: palette.text, fontSize: 13 },
  replyCount: { color: palette.muted, fontSize: 12, marginTop: 12 },
  reportButton: { alignSelf: 'flex-start', paddingVertical: 10, marginTop: 3 },
  reportText: { color: '#f5a7b8', fontSize: 12, fontWeight: '700' },
});
