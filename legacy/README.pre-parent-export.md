# Se-kret-Bip
import React, { useState, useEffect, useRef } from 'react'; 
import BottomNav from './components/BottomNav';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
 ScrollView,
  TextInput,
  View,
  Animated,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {
  
  const [circlePostText, setCirclePostText] = useState('');
  const [circlePosts, setCirclePosts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [screen, setScreen] = useState('home');
  const [journalText, setJournalText] = useState('');
  const [mood, setMood] = useState('Happy');
  const [theme, setTheme] = useState('night');
  const [entries, setEntries] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
 const [userRole, setUserRole] = useState('teen');
const [sharedMoments, setSharedMoments] = useState([]);
const [supportAlerts, setSupportAlerts] = useState([]);
const [parentMessages, setParentMessages] = useState([]);


  const breatheAnim = useRef(new Animated.Value(1)).current;
  const comfortMessages = [
    { emoji: '🌙', text: "You've survived every hard day so far. That matters." },
    { emoji: '☁️', text: 'Rest is productive too. You are allowed to pause.' },
    { emoji: '💙', text: "Someone is glad you’re still here tonight." },
    { emoji: '🌧️', text: 'Bad moments are real. So is your strength.' },
    { emoji: '✨', text: 'You don’t need to be perfect to be loved.' },
    { emoji: '🫶', text: 'Your feelings are allowed here.' },
    { emoji: '🕯️', text: 'Soft moment. Slow breath. Stay with me.' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
  saveData();
}, [journalText, mood, theme, entries, moodHistory, voiceNotes, circlePosts]);
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(breatheAnim, {
        toValue: 1.1,
        duration: 2200,
        useNativeDriver: true,
      }),
  
      Animated.timing(breatheAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('journalText', journalText);
      await AsyncStorage.setItem('mood', mood);
      await AsyncStorage.setItem('theme', theme);
      await AsyncStorage.setItem('entries', JSON.stringify(entries));
      await AsyncStorage.setItem('moodHistory', JSON.stringify(moodHistory));
      await AsyncStorage.setItem('voiceNotes', JSON.stringify(voiceNotes));
      await AsyncStorage.setItem('circlePosts', JSON.stringify(circlePosts));
    } catch (error) {
      console.log('Save error:', error);
    }
  };

  const loadData = async () => {
    try {
      const savedJournal = await AsyncStorage.getItem('journalText');
      const savedMood = await AsyncStorage.getItem('mood');
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedEntries = await AsyncStorage.getItem('entries');
      const savedMoodHistory = await AsyncStorage.getItem('moodHistory');
      const savedVoiceNotes = await AsyncStorage.getItem('voiceNotes');
      const savedCirclePosts = await AsyncStorage.getItem('circlePosts');

      if (savedJournal !== null) setJournalText(savedJournal);
      if (savedMood !== null) setMood(savedMood);
      if (savedTheme !== null) setTheme(savedTheme);
      if (savedEntries !== null) setEntries(JSON.parse(savedEntries));
      if (savedMoodHistory !== null) setMoodHistory(JSON.parse(savedMoodHistory));
      if (savedVoiceNotes !== null) setVoiceNotes(JSON.parse(savedVoiceNotes));
      if (savedCirclePosts !== null) setCirclePosts(JSON.parse(savedCirclePosts));
    } catch (error) {
      console.log('Load error:', error);
    }
  };

  const getBackground = () => {
    if (theme === 'flower') return '#2D1B3D';
    if (theme === 'rain') return '#1E293B';
    return '#3B1930';
  };

  const getHeroText = () => {
    if (mood === 'Happy') return "I’m glad\nyou’re smiling\ntonight 🌤️";
    if (mood === 'Sad') return "I’m here with\nyou tonight ☁️";
    if (mood === 'Angry') return "Let it out,\nyou’re safe here 🔥";
    if (mood === 'Tired') return "Rest your heart\ntonight 🌙";
    return "Welcome back 🌙";
  };

  const selectMood = (newMood) => {
    setMood(newMood);

    const newMoodEntry = {
      id: Date.now(),
      mood: newMood,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    setMoodHistory([newMoodEntry, ...moodHistory]);
  }; 
  
  const saveEntry = () => {
  if (journalText.trim() === '') return;

  const newEntry = {
    id: Date.now(),
    text: journalText,
    mood,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  setEntries([newEntry, ...entries]);
  setJournalText('');
};

const saveVoiceNote = () => {
  const newVoiceNote = {
    id: Date.now(),
    title: 'Practice voice note',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  setVoiceNotes([newVoiceNote, ...voiceNotes]);
};

const saveCirclePost = () => {
  if (circlePostText.trim() === '') return;

  const newPost = {
    id: Date.now(),
    text: circlePostText,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    reactions: {
      glow: 0,
      heart: 0,
      moon: 0,
    },
  };

  setCirclePosts([newPost, ...circlePosts]);
  setCirclePostText('');
};

const reactToPost = (postId, reactionType) => {
  setCirclePosts(
    circlePosts.map((post) =>
      post.id === postId
        ? {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: post.reactions[reactionType] + 1,
            },
          }
        : post
    )
  );
};

const changeMessage = () => {
  setMessageIndex((prevIndex) => (prevIndex + 1) % comfortMessages.length);
};
const switchRole = () => {
  if (userRole === 'teen') {
    setUserRole('parent');
  } else {
    setUserRole('teen');
  }
};
if (screen === 'pages') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>💜 Se’kret Pages</Text>

      <Text style={styles.subtitle}>
        Your private emotional world.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>💜</Text>
        <Text style={styles.cardText}>
          Built for expression, not pressure.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setScreen('journal')}>
        <Text style={styles.buttonText}>✍️ Write It Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setScreen('voice')}>
        <Text style={styles.buttonText}>🎙️ Bippin BRB</Text>
      </TouchableOpacity>

      <View style={styles.entryCard}>
        <Text style={styles.entryText}>💭 Floating thoughts.</Text>
        <Text style={styles.entryText}>🎧 Voice moments.</Text>
        <Text style={styles.entryText}>🔐 Private emotional space.</Text>
      </View>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}
if (screen === 'journal') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>✍️ Write It Out</Text>

      <Text style={styles.subtitle}>
        A private page for whatever your heart needs to say.
      </Text>

      <TextInput
        style={styles.journalInput}
        placeholder="Write your Se’kret here..."
        placeholderTextColor="#94A3B8"
        multiline
        value={journalText}
        onChangeText={setJournalText}
      />

      <TouchableOpacity style={styles.button} onPress={saveEntry}>
        <Text style={styles.buttonText}>Save Page 💜</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Saved Pages</Text>

      {entries.map((entry) => (
        <View key={entry.id} style={styles.entryCard}>
          <Text style={styles.entryDate}>
            {entry.date} • {entry.time} • {entry.mood}
          </Text>

          <Text style={styles.entryText}>{entry.text}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={() => setScreen('pages')}>
        <Text style={styles.buttonText}>Back to Se’kret Pages 💜</Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
    </ScrollView>
  );
}

  if (screen === 'calm') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>🌙 Bip Calmly</Text>

      <Text style={styles.subtitle}>
        Stay here a sec.
      </Text>

      <Animated.View
        style={[
          styles.circle,
          { transform: [{ scale: breatheAnim }] },
        ]}
      >
        <Text style={styles.circleText}>Breathe</Text>
      </Animated.View>

      <View style={styles.messageCard}>

        <Text style={styles.cardEmoji}>
          {comfortMessages[messageIndex].emoji}
        </Text>

        <Text style={styles.cardText}>
          {comfortMessages[messageIndex].text}
        </Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={changeMessage}
        >
          <Text style={styles.smallButtonText}>
            Another Calm Thought ✨
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.entryCard}>

        <Text style={styles.entryText}>
          🫧 Unclench your jaw.
        </Text>

        <Text style={styles.entryText}>
          🌙 Relax your shoulders.
        </Text>

        <Text style={styles.entryText}>
          💧 Drink some water.
        </Text>

        <Text style={styles.entryText}>
          📵 Step away from the noise for a minute.
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('mindReset')}
      >
        <Text style={styles.buttonText}>
          🌙 7-Min Mind Reset
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('bodyReset')}
      >
        <Text style={styles.buttonText}>
          🫧 7-Min Body Reset
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}
if (screen === 'mindReset') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>🌙 7-Min Mind Reset</Text>

      <Text style={styles.subtitle}>
        Slow the thoughts. Come back to you.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>🌙</Text>

        <Text style={styles.cardText}>
          Minute by minute. No pressure. Just reset.
        </Text>
      </View>

      <View style={styles.entryCard}>

        <Text style={styles.entryText}>
          1️⃣ Drop your shoulders.
        </Text>

        <Text style={styles.entryText}>
          2️⃣ Breathe slower than your thoughts.
        </Text>

        <Text style={styles.entryText}>
          3️⃣ Name 3 things you can see.
        </Text>

        <Text style={styles.entryText}>
          4️⃣ Sip water before replying to anyone.
        </Text>

        <Text style={styles.entryText}>
          5️⃣ Let one thought pass without chasing it.
        </Text>

        <Text style={styles.entryText}>
          6️⃣ You do not have to solve everything tonight.
        </Text>

        <Text style={styles.entryText}>
          7️⃣ One more breath. You’re still here.
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('calm')}
      >
        <Text style={styles.buttonText}>
          Back to Bip Calmly 🌙
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}
 
 if (screen === 'bodyReset') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>🫧 7-Min Body Reset</Text>

      <Text style={styles.subtitle}>
        Move the stress out softly.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>🫧</Text>

        <Text style={styles.cardText}>
          No workout pressure. Just loosen up.
        </Text>
      </View>

      <View style={styles.entryCard}>

        <Text style={styles.entryText}>1️⃣ Roll your neck slowly.</Text>
        <Text style={styles.entryText}>2️⃣ Shrug your shoulders up, then drop them.</Text>
        <Text style={styles.entryText}>3️⃣ Shake your hands out.</Text>
        <Text style={styles.entryText}>4️⃣ Stretch your arms over your head.</Text>
        <Text style={styles.entryText}>5️⃣ Walk around the room for one minute.</Text>
        <Text style={styles.entryText}>6️⃣ Do a tiny dance break. Yes, really 😭</Text>
        <Text style={styles.entryText}>7️⃣ One deep breath. Tell your body thank you.</Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('calm')}
      >
        <Text style={styles.buttonText}>
          Back to Bip Calmly 🌙
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}

  if (screen === 'growth') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Growth Garden 🌱</Text>
        <Text style={styles.subtitle}>Tiny steps still count. Your growth does not have to be loud.</Text>

        <View style={styles.messageCard}>
          <Text style={styles.cardEmoji}>🌿</Text>
          <Text style={styles.cardText}>Today’s growth: showing up for yourself.</Text>
        </View>

        <View style={styles.entryCard}>
          <Text style={styles.entryText}>🌱 Drink water</Text>
          <Text style={styles.entryText}>🌱 Take one soft breath</Text>
          <Text style={styles.entryText}>🌱 Write one honest sentence</Text>
        </View>

       <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
      </ScrollView>
    );
  }

  if (screen === 'history') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Mood History 📈</Text>
        <Text style={styles.subtitle}>Your feelings have a story. Bip remembers gently.</Text>

        {moodHistory.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.cardEmoji}>📊</Text>
            <Text style={styles.cardText}>Choose a mood on Home to start your history.</Text>
          </View>
        ) : (
          moodHistory.map((item) => (
            <View key={item.id} style={styles.entryCard}>
              <Text style={styles.entryText}>{item.mood}</Text>
              <Text style={styles.entryDate}>{item.date} • {item.time}</Text>
            </View>
          ))
        )}

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
      </ScrollView>
    );
  }

  if (screen === 'voice') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>Voice Notes 🎙️</Text>

      <Text style={styles.subtitle}>
        {isRecording
          ? 'Se’kret is listening... let your orb speak.'
          : 'Tap record when you’re ready to Bip it out.'}
      </Text>

      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: breatheAnim }],
            marginBottom: 30,
            backgroundColor: isRecording ? '#EF4444' : '#3B82F6',
          },
        ]}
      >
        <Text style={styles.circleText}>
          {isRecording ? '🔴' : '🎙️'}
        </Text>
      </Animated.View>

      {isRecording && (
        <View style={styles.waveRow}>
          <Animated.View
            style={[
              styles.waveBar,
              {
                transform: [{ scaleY: breatheAnim }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 60,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.6],
                  }),
                }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 35,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.3],
                  }),
                }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 75,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.8],
                  }),
                }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 45,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.4],
                  }),
                }],
              },
            ]}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isRecording && { backgroundColor: '#EF4444' }]}
        onPress={() => {
          if (isRecording) {
            saveVoiceNote();
          }

          setIsRecording(!isRecording);
        }}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Bippin 🎙️'}
        </Text>
      </TouchableOpacity>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>🌙</Text>
        <Text style={styles.cardText}>
          {isRecording
            ? 'No pressure. No perfect words. Just let it out.'
            : 'Your voice notes are little pieces of your story.'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Saved Bips</Text>

      {voiceNotes.length === 0 ? (
        <View style={styles.entryCard}>
          <Text style={styles.entryText}>
            No voice Bips yet. When you stop recording, Se’kret will save the moment here.
          </Text>
        </View>
      ) : (
        voiceNotes.map((note) => (
          <View key={note.id} style={styles.entryCard}>
            <Text style={styles.entryText}>🎧 {note.title}</Text>
            <Text style={styles.entryDate}>{note.date} • {note.time}</Text>
          </View>
        ))
      )}

     <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
    </ScrollView>
  );
}

if (screen === 'circle') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>Bip Circle 🌐</Text>

      <Text style={styles.subtitle}>
        A soft anonymous space to vent, heal, and connect.
      </Text>

      <TextInput
        style={styles.journalInput}
        placeholder="Share something with the Circle..."
        placeholderTextColor="#94A3B8"
        multiline
        value={circlePostText}
        onChangeText={setCirclePostText}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveCirclePost}
      >
        <Text style={styles.buttonText}>Post to Circle ✨</Text>
      </TouchableOpacity>
<TouchableOpacity
  style={styles.button}
  onPress={() => setScreen('bity')}
>
  <Text style={styles.buttonText}>🏙️ My Bity</Text>
</TouchableOpacity>
      <Text style={styles.sectionTitle}>Recent Bips</Text>

      {circlePosts.length === 0 ? (
        <View style={styles.entryCard}>
          <Text style={styles.entryText}>
            No Circle posts yet. Your words could help someone tonight.
          </Text>
        </View>
      ) : (
        circlePosts.map((post) => (
          <View key={post.id} style={styles.entryCard}>

            <Text style={styles.entryDate}>
              {post.date} • {post.time}
            </Text>

            <Text style={styles.entryText}>
              {post.text}
            </Text>

            <View style={styles.reactionRow}>

            <TouchableOpacity
  style={styles.reactionButton}
  onPress={() => reactToPost(post.id, 'glow')}
>
                <Text style={styles.reactionText}>
                  ✨ {post.reactions.glow}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
  style={styles.reactionButton}
  onPress={() => reactToPost(post.id, 'heart')}
> <Text style={styles.reactionText}>
                  💙 {post.reactions.heart}
                </Text>
              </TouchableOpacity>

            <TouchableOpacity
  style={styles.reactionButton}
  onPress={() => reactToPost(post.id, 'moon')}
>
                <Text style={styles.reactionText}>
                  🌙 {post.reactions.moon}
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        ))
      )}

          <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
    </ScrollView>
  );
}
if (screen === 'bity') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>🏙️ My Bity</Text>

      <Text style={styles.subtitle}>
        Your people. Your peace. Your support system.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>💜</Text>

        <Text style={styles.cardText}>
          Built on trust, not control.
        </Text>
      </View>

      <View style={styles.entryCard}>
        <Text style={styles.entryText}>
          🌱 Shared Growth: 4
        </Text>

        <Text style={styles.entryText}>
          👥 Trusted Peers: 8
        </Text>

        <Text style={styles.entryText}>
          💬 Real Talks: 12
        </Text>

        <Text style={styles.entryText}>
          ✨ Support Streak: 5
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('parentBridge')}
      >
        <Text style={styles.buttonText}>
          💜 Se’krets 2 Tell
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}

  if (screen === 'parentPortal') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>👨‍👩‍👧 Parent Portal</Text>

      <Text style={styles.subtitle}>
        Support without pressure. Connection without control.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>💜</Text>

        <Text style={styles.cardText}>
          Your role is support, not surveillance.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('parentBridge')}
      >
        <Text style={styles.buttonText}>
          💜 Se’krets 2 Tell
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('conversationKits')}
      >
        <Text style={styles.buttonText}>
          🧠 Conversation Kits
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('parentReflections')}
      >
        <Text style={styles.buttonText}>
          💭 Parent Reflections
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('supportAlerts')}
      >
        <Text style={styles.buttonText}>
          🚨 Support Alerts
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
} if (screen === 'parentBridge') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>💜 Se’krets 2 Tell</Text>

      <Text style={styles.subtitle}>
        Growth between us. Built on trust, not control.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>💜</Text>
        <Text style={styles.cardText}>Parent Bridge Active</Text>
      </View>

      <View style={styles.entryCard}>
        <Text style={styles.entryText}>Parents get support signals, not private Se’kret pages.</Text>
        <Text style={styles.entryText}>Mood energy today: Soft / Low</Text>
        <Text style={styles.entryText}>Best support style: Encourage, don’t pressure.</Text>
      </View>

      <View style={styles.entryCard}>
        <Text style={styles.entryText}>💬 Try: “Want advice or just company?”</Text>
        <Text style={styles.entryText}>🌙 Try: “I’m here. Do you want space or support?”</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setScreen('bity')}>
        <Text style={styles.buttonText}>Back to My Bity 🏙️</Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
    </ScrollView>
  );
}

  if (screen === 'conversationKits') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>🧠 Conversation Kits</Text>

      <Text style={styles.subtitle}>
        Softer words for hard moments.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>💜</Text>

        <Text style={styles.cardText}>
          The goal is connection, not winning.
        </Text>
      </View>

      <View style={styles.entryCard}>
        <Text style={styles.entryText}>
          Instead of: “What’s wrong with you?”
        </Text>

        <Text style={styles.entryText}>
          Try: “I can tell something feels heavy.”
        </Text>
      </View>

      <View style={styles.entryCard}>
        <Text style={styles.entryText}>
          Instead of: “You never talk to me.”
        </Text>

        <Text style={styles.entryText}>
          Try: “I miss hearing your thoughts.”
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('parentPortal')}
      >
        <Text style={styles.buttonText}>
          Back to Parent Portal 👨‍👩‍👧
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}  
if (screen === 'parentReflections') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>💭 Parent Reflections</Text>

      <Text style={styles.subtitle}>
        A private space for parents to pause, reflect, and respond with care.
      </Text>

      <View style={styles.messageCard}>

        <Text style={styles.cardEmoji}>💜</Text>

        <Text style={styles.cardText}>
          Parenting while emotionally exhausted is still parenting.
        </Text>

      </View>

      <View style={styles.entryCard}>

        <Text style={styles.entryText}>
          ✍️ Reflect before reacting.
        </Text>

        <Text style={styles.entryText}>
          🌙 Your child may need safety before solutions.
        </Text>

        <Text style={styles.entryText}>
          🧠 Curiosity connects better than pressure.
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('parentPortal')}
      >
        <Text style={styles.buttonText}>
          Back to Parent Portal 👨‍👩‍👧
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}
if (screen === 'supportAlerts') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>🚨 Support Alerts</Text>

      <Text style={styles.subtitle}>
        Gentle awareness. Never surveillance.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>🌙</Text>

        <Text style={styles.cardText}>
          Bip only shares emotional support signals — not private thoughts.
        </Text>
      </View>

      <View style={styles.entryCard}>

        <Text style={styles.entryText}>
          💜 Mood energy lower than usual this week.
        </Text>

        <Text style={styles.entryText}>
          🌙 Increased late-night Bip Calmly sessions.
        </Text>

        <Text style={styles.entryText}>
          🫧 Suggested support style: softer check-ins.
        </Text>

      </View>

      <View style={styles.entryCard}>

        <Text style={styles.entryText}>
          ✅ Helpful:
        </Text>

        <Text style={styles.entryText}>
          “I’m here if you need me.”
        </Text>

        <Text style={styles.entryText}>
          ❌ Avoid:
        </Text>

        <Text style={styles.entryText}>
          “What’s going on with you lately?”
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('parentPortal')}
      >
        <Text style={styles.buttonText}>
          Back to Parent Portal 👨‍👩‍👧
        </Text>
      </TouchableOpacity>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />

    </ScrollView>
  );
}
if (screen === 'comfort') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Comfort Mode 🚨</Text>
        <Text style={styles.subtitle}>When it feels heavy, Bip stays with you.</Text>

        <View style={styles.messageCard}>
          <Text style={styles.cardEmoji}>💙</Text>
          <Text style={styles.cardText}>You are not alone in this moment.</Text>
        </View>

        <View style={styles.entryCard}>
          <Text style={styles.entryText}>1. Put both feet on the floor.</Text>
          <Text style={styles.entryText}>2. Name 3 things you can see.</Text>
          <Text style={styles.entryText}>3. Take one slow breath.</Text>
          <Text style={styles.entryText}>4. Tap Calm if you need to breathe.</Text>
        </View>

       <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
      </ScrollView>
    );
  }

  if (screen === 'more') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>More ✨</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('growth')}
      >
        <Text style={styles.buttonText}>🌱 Growth Garden</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('history')}
      >
        <Text style={styles.buttonText}>📈 Mood History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('circle')}
      >
        <Text style={styles.buttonText}>🌐 Bip Circle</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={[
    styles.button,
    userRole === 'teen' && {
      backgroundColor: '#475569',
      opacity: 0.6,
    },
  ]}
  onPress={() => {
    if (userRole === 'parent') {
      setScreen('parentPortal');
    }
  }}
>
  <Text style={styles.buttonText}>
    {userRole === 'teen'
      ? '🔒 Parent Portal'
      : '👨‍👩‍👧 Parent Portal'}
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => setScreen('comfort')}
>
  <Text style={styles.buttonText}>🚨 Comfort Mode</Text>
</TouchableOpacity>
        <Text style={styles.buttonText}>🚨 Comfort Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('settings')}
      >
        <Text style={styles.buttonText}>⚙️ Settings</Text>
      </TouchableOpacity>

     <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
    </ScrollView>
  );
}

  if (screen === 'settings') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Settings ⚙️</Text>
        <Text style={styles.subtitle}>Choose your Bip vibe.</Text>

        <View style={styles.themeRow}>
          <TouchableOpacity style={styles.themeBubble} onPress={() => setTheme('night')}>
            <Text style={styles.themeEmoji}>🌙</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeBubble} onPress={() => setTheme('flower')}>
            <Text style={styles.themeEmoji}>🌸</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeBubble} onPress={() => setTheme('rain')}>
            <Text style={styles.themeEmoji}>🌧️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.currentMood}>Current Theme: {theme}</Text>

      <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
      <Text style={styles.logo}>Se’kret Bip</Text>
      <Text style={styles.heroText}>{getHeroText()}</Text>

<TouchableOpacity

  style={styles.smallButton}

  onPress={switchRole}

>

  <Text style={styles.smallButtonText}>

    {userRole === 'teen'

      ? '💜 Teen Mode'

      : '👨‍👩‍👧 Parent Mode'}

  </Text>

</TouchableOpacity>

<Text style={styles.subtitle}>
      <Text style={styles.subtitle}>
        A safe place for your emotions, thoughts, and growth.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>{comfortMessages[messageIndex].emoji}</Text>
        <Text style={styles.cardText}>{comfortMessages[messageIndex].text}</Text>

        <TouchableOpacity style={styles.smallButton} onPress={changeMessage}>
          <Text style={styles.smallButtonText}>New Message ✨</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.moodRow}>
        {[
          ['Happy', '😊'],
          ['Sad', '😔'],
          ['Angry', '😡'],
          ['Tired', '😴'],
        ].map((item) => (
          <TouchableOpacity
            key={item[0]}
            style={[styles.moodBubble, mood === item[0] && styles.selectedMoodBubble]}
            onPress={() => selectMood(item[0])}
          >
            <Text style={styles.moodEmoji}>{item[1]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.currentMood}>Current Mood: {mood}</Text>

     <BottomNav screen={screen} setScreen={setScreen} styles={styles} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 60,
  },

  logo: {
  fontSize: 34,
  fontWeight: '900',
  color: '#FFFFFF',
  marginBottom: 40,
},

heroText: {
  fontSize: 42,
  fontWeight: '900',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: 52,
  marginBottom: 30,
},

welcome: {
  fontSize: 30,
  fontWeight: '900',
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: 14,
},

subtitle: {
  fontSize: 18,
  color: '#CBD5E1',
  textAlign: 'center',
  lineHeight: 28,
  marginBottom: 40,
  fontWeight: '700',
},

cardEmoji: {
  fontSize: 42,
  marginBottom: 18,
},

cardText: {
  fontSize: 24,
  color: '#FFFFFF',
  fontWeight: '900',
  textAlign: 'center',
  lineHeight: 34,
  marginBottom: 24,
},

buttonText: {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: '900',
},

currentMood: {
  fontSize: 22,
  fontWeight: '900',
  color: '#FFFFFF',
  marginBottom: 32,
  textAlign: 'center',
},

sectionTitle: {
  fontSize: 26,
  fontWeight: '900',
  color: '#FFFFFF',
  alignSelf: 'flex-start',
  marginBottom: 16,
},

entryText: {
  color: '#FFFFFF',
  fontSize: 17,
  lineHeight: 26,
  fontWeight: '700',
  marginBottom: 8,
},

circleText: {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: '900',
},

entryDate: {
  color: '#CBD5E1',
  fontSize: 14,
  fontWeight: '800',
  marginBottom: 8,
},

circle: {
  width: 170,
  height: 170,
  borderRadius: 85,
  backgroundColor: '#3B82F6',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 55,
  shadowColor: '#60A5FA',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.9,
  shadowRadius: 25,
  elevation: 18,
},
waveRow: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 35,
},

waveBar: {
  width: 10,
  height: 50,
  backgroundColor: '#60A5FA',
  borderRadius: 20,
},
  
  reactionRow: {
  flexDirection: 'row',
  marginTop: 18,
  gap: 12,
},

reactionButton: {
  backgroundColor: '#334155',
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
},

reactionText: {
  color: '#FFFFFF',
  fontWeight: '800',
  fontSize: 14,
},

    bottomNav: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

 navItem: {
  alignItems: 'center',
  width: '20%',
},

  navIcon: {
    fontSize: 22,
    textAlign: 'center',
  },

   navText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  
  messageCard: {
  width: '100%',
  backgroundColor: '#1E293B',
  padding: 24,
  borderRadius: 30,
  marginBottom: 28,
  alignItems: 'center',
},

button: {
  backgroundColor: '#3B82F6',
  width: '100%',
  paddingVertical: 18,
  borderRadius: 22,
  alignItems: 'center',
  marginBottom: 22,
},

smallButton: {
  backgroundColor: '#334155',
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 18,
},

smallButtonText: {
  color: '#FFFFFF',
  fontWeight: '800',
  fontSize: 15,
},

journalInput: {
  width: '100%',
  minHeight: 180,
  backgroundColor: '#1E293B',
  borderRadius: 24,
  padding: 20,
  color: '#FFFFFF',
  fontSize: 17,
  textAlignVertical: 'top',
  marginBottom: 24,
},

entryCard: {
  width: '100%',
  backgroundColor: '#1E293B',
  borderRadius: 24,
  padding: 20,
  marginBottom: 18,
},

moodRow: {
  flexDirection: 'row',
  gap: 14,
  marginBottom: 24,
},

moodBubble: {
  width: 70,
  height: 70,
  borderRadius: 35,
  backgroundColor: '#1E293B',
  alignItems: 'center',
  justifyContent: 'center',
},

selectedMoodBubble: {
  backgroundColor: '#3B82F6',
},

moodEmoji: {
  fontSize: 30,
},

themeRow: {
  flexDirection: 'row',
  gap: 18,
  marginBottom: 30,
},

themeBubble: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#1E293B',
  alignItems: 'center',
  justifyContent: 'center',
},

themeEmoji: {
  fontSize: 34,
},


  activeNavText: {
    color: '#FFFFFF',
  },
});