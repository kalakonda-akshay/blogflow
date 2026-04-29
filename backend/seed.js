const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const USERS = [
  { name: 'Alice Chen',  email: 'alice@blogflow.com', password: 'pass1234', bio: 'Software engineer & tech writer.' },
  { name: 'Bob Martins', email: 'bob@blogflow.com',   password: 'pass1234', bio: 'Travel blogger and photographer.' },
];

const POSTS = [
  { title: 'Getting Started with React Hooks in 2024', content: '## useState — The Basics\n\nReact Hooks changed how we write components. The most fundamental hook is useState:\n\n```js\nconst [count, setCount] = useState(0);\n```\n\n## useEffect — Side Effects\n\nuseEffect lets you perform side effects. It replaces lifecycle methods:\n\n```js\nuseEffect(() => {\n  document.title = `Clicked ${count} times`;\n}, [count]);\n```\n\n## Custom Hooks\n\nThe real power comes from custom hooks that encapsulate reusable stateful logic. Any function starting with "use" is a hook.\n\nHooks make code more readable, testable, and shareable.', category: 'Tech', coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', tags: ['react','javascript','hooks'] },
  { title: 'A Week in Kyoto: Temples, Tea & Quiet Streets', content: 'Kyoto moves differently from Tokyo. Where Tokyo pulses with urgency, Kyoto breathes with intention.\n\n## Fushimi Inari at Dawn\n\nArrive before 6am and you\'ll have the thousand torii gates almost entirely to yourself. The path winds uphill for two hours, each gate a deep vermilion against the grey morning sky.\n\n## The Tea Ceremony\n\nWe found a small tea house off Gion\'s main street, run by an elderly woman who has been practicing for forty years. Watch the hands. Follow the rhythm.\n\n## Philosopher\'s Path\n\nThe canal walk between Ginkaku-ji and Nanzen-ji is short — barely two kilometres — but walk slowly.\n\nKyoto doesn\'t ask to be photographed. It asks to be sat with.', category: 'Travel', coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', tags: ['japan','kyoto','travel'] },
  { title: 'Building a Morning Routine That Actually Sticks', content: 'Most morning routines fail not because of lack of willpower, but because they\'re designed for an imaginary, frictionless version of yourself.\n\n## Start With One Habit\n\nThe temptation is to overhaul everything at once. This almost always collapses within a week.\n\nInstead: pick one habit. Just one. Make it small enough to feel slightly embarrassing.\n\n## Stack, Don\'t Stack\n\nHabit stacking is powerful, but only stack habits of similar size. Don\'t link "make coffee" to "30-minute run."\n\n## Protect the First Hour\n\nThe morning is vulnerable to colonisation by other people\'s priorities. A morning routine creates a buffer.\n\nEven 20 uninterrupted minutes changes the quality of the day.', category: 'Health', coverImage: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800', tags: ['health','habits','morning'] },
];

const COMMENTS = [
  ['This is exactly what I needed. Bookmarked!', 'Really well written — the examples make it clear.'],
  ['Lovely piece. Made me want to book a flight immediately.', 'Beautiful writing. The tea ceremony section gave me chills.'],
  ['This is so true. I tried a 10-habit routine and lasted 3 days!', 'Protecting the first hour has been a game changer for me.'],
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    await Promise.all([User.deleteMany(), Post.deleteMany(), Comment.deleteMany()]);
    const users = await User.create(USERS);
    console.log(`Created ${users.length} users`);
    const posts = [];
    for (let i = 0; i < POSTS.length; i++) {
      const p = await Post.create({ ...POSTS[i], author: users[i % users.length]._id });
      posts.push(p);
    }
    console.log(`Created ${posts.length} posts`);
    for (let i = 0; i < posts.length; i++) {
      await Comment.create([
        { content: COMMENTS[i][0], author: users[(i+1)%users.length]._id, post: posts[i]._id },
        { content: COMMENTS[i][1], author: users[i%users.length]._id,     post: posts[i]._id },
      ]);
    }
    console.log('Created comments');
    console.log('\nSeed done!\n  alice@blogflow.com / pass1234\n  bob@blogflow.com   / pass1234\n');
    process.exit(0);
  } catch (e) { console.error(e.message); process.exit(1); }
}
seed();
