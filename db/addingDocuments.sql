// Sample Users
db.users.insertMany([
  {
    _id: ObjectId("662fa1111111111111111111"),
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    profile_pic: "https://example.com/images/alice.jpg",
    last_active: new Date()
  },
  {
    _id: ObjectId("662fa1222222222222222222"),
    name: "Bob Smith",
    email: "bob@example.com",
    password: "securePass456",
    profile_pic: "https://example.com/images/bob.jpg",
    last_active: new Date()
  },
  {
    _id: ObjectId("662fa1333333333333333333"),
    name: "Carol Davis",
    email: "carol@example.com",
    password: "carolPass789",
    profile_pic: "https://example.com/images/carol.jpg",
    last_active: new Date()
  }
]);

// Sample Chat
db.chats.insertOne({
  _id: ObjectId("6630a1444444444444444444"),
  name: "Project Alpha",
  admin_list: ["662fa1111111111111111111"],
  user_list: [
    "662fa1111111111111111111",
    "662fa1222222222222222222",
    "662fa1333333333333333333"
  ],
  nickname_list: [
    { user_id: "662fa1111111111111111111", nickname: "Alice" },
    { user_id: "662fa1222222222222222222", nickname: "Bobby" },
    { user_id: "662fa1333333333333333333", nickname: "C-Dawg" }
  ],
  message_list: ["6630b1555555555555555555", "6630b1666666666666666666"]
});

// Sample Messages
db.messages.insertMany([
  {
    _id: ObjectId("6630b1555555555555555555"),
    chat_id: "6630a1444444444444444444",
    sender_id: "662fa1111111111111111111",
    content: "Hey team, ready to start the project?",
    timestamp: new Date()
  },
  {
    _id: ObjectId("6630b1666666666666666666"),
    chat_id: "6630a1444444444444444444",
    sender_id: "662fa1222222222222222222",
    content: "Absolutely! Let's get going.",
    timestamp: new Date()
  }
]);

// Sample Message History
db.message_history.insertOne({
  message_id: "6630b1666666666666666666",
  edited_at: new Date(),
  original_content: "Absolutely! Let’s go.",
  edited_content: "Absolutely! Let's get going.",
  edited_by: "662fa1222222222222222222"
});
