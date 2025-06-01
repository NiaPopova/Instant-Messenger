import * as express from 'express';
import * as bcrypt from 'bcrypt';
import {User} from '../models/user';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email, name } = req.body;
    
  if (!username || username.length < 4) {
    return res.status(400).json({ message: "Username must be at least 4 characters." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  if (!name || name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
    //   id: uuidv4(),
      username,
      password: hashedPassword,
      email,
      name,
      last_active: new Date().toISOString(),
      profile_pic: "uploads/default.png"
    });

    await newUser.save();

    const { password: _, ...userSafe } = newUser.toObject();
    res.status(201).json({ message: 'User registered', user: userSafe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  
  try {
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
    }

    user.last_active = new Date();
    await user.save();

    const { password: _, ...userSafe } = user.toObject();
    res.status(200).json({ message: 'Login successful', user: userSafe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      const { password: _, ...userSafe } = user.toObject();
      res.json(userSafe);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;