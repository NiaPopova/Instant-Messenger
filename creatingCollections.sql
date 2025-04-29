//mongodb+srv://webtex_user:HoS07qMyxfJPRArf@webtex.zx17a.mongodb.net/?retryWrites=true&w=majority&appName=Webtex

use webtex;
db.users.drop();
db.chats.drop();
db.messages.drop();
db.message_history.drop();

db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "password", "profile_pic", "last_active"],
            properties: {
                name:{
                    bsonType: "string",
                    description: "Name must be a string"
                },
                email:{
                    bsonType: "string",
                    pattern: "^\\S+@\\S+\\.\\S+$",
                    description: "Email must be a string."
                },
                password: {
                    bsonType: "string",
                    description: "Password must be a string."
                },
                profile_pic: {
                    bsonType: "string",
                    description: "Profile picture must be a string(URL)."
                },
                last_active: {
                    bsonType: "date",
                    description: "Last active must be a date."
                },
            }
        }
    }
});

db.createCollection("chats", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "admin_list", "user_list", "nickname_list", "message_list"],
            properties: {
                name: {
                    bsonType: "string",
                    maxLength: 50,
                    description: "Name of chat must be a string."
                },
                admin_list: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    description: "List of user IDs that are admins"
                },
                user_list: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    minItems: 2,
                    maxItems: 5,
                    description: "List of user IDs in the chat."
                },
                nickname_list: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["user_id", "nickname"],
                        properties: {
                            user_id: {
                                bsonType: "string",
                                description: "The user's unique ID"
                            },
                            nickname: {
                            bsonType: "string",
                            maxLength: 30,
                            description: "The user's nickname in the chat"
                            }
                        },
                    description: "List of user IDs in the chat."
                    }
                },
                message_list: {
                    bsonType : "array",
                    items: {
                        bsonType: "string",
                    },
                    description: "List of message IDs"
                }
            }
        }
    }
});

db.createCollection("messages", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["chat_id", "sender_id", "content", "timestamp"],
            properties: {
                chat_id: {
                    bsonType: "string",
                    description: "ID of the chat where the message was sent."
                },
                sender_id: {
                    bsonType: "string",
                    description: "ID of the user who sent the message."
                },
                content: {
                    bsonType: "string",
                    description: "Content of the message."
                },
                timestamp: {
                    bsonType: "date",
                    description: "Timestamp when the message was sent."
                }
            }
        }
    }
});

db.createCollection("message_history", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["message_id", "edited_at", "original_content", "edited_content"],
            properties: {
                message_id: {
                    bsonType: "string",
                    description: "ID of the original message."
                },
                edited_at: {
                    bsonType: "date",
                    description: "Timestamp when the message was edited."
                },
                original_content: {
                    bsonType: "string",
                    description: "The original content of the message before editing."
                },
                edited_content: {
                    bsonType: "string",
                    description: "The new content of the message after editing."
                },
                edited_by: {
                    bsonType: "string",
                    description: "ID of the user who edited the message."
                }
            }
        }
    }
});

