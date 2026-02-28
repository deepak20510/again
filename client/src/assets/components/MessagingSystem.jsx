import { useState, useEffect, useRef } from "react";
import ApiService from "../../services/api";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  User,
  Circle,
} from "lucide-react";

export default function MessagingSystem() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      // Mock conversations data
      setConversations([
        {
          id: 1,
          name: "Sarah Johnson",
          avatar: null,
          lastMessage: "That sounds great! When can we start?",
          timestamp: "2 min ago",
          unread: 2,
          online: true,
          role: "TRAINER",
        },
        {
          id: 2,
          name: "Tech Academy",
          avatar: null,
          lastMessage: "The materials have been uploaded successfully",
          timestamp: "1 hour ago",
          unread: 0,
          online: false,
          role: "INSTITUTION",
        },
        {
          id: 3,
          name: "Mike Chen",
          avatar: null,
          lastMessage: "Thanks for the quick response!",
          timestamp: "3 hours ago",
          unread: 0,
          online: true,
          role: "TRAINER",
        },
      ]);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      // Mock messages data
      setMessages([
        {
          id: 1,
          senderId: "other",
          content: "Hi! I'm interested in your React training program.",
          timestamp: "10:00 AM",
          status: "read",
        },
        {
          id: 2,
          senderId: "me",
          content: "Hello! Great to hear from you. Our React program covers everything from basics to advanced concepts.",
          timestamp: "10:05 AM",
          status: "read",
        },
        {
          id: 3,
          senderId: "other",
          content: "Perfect! What's the duration and cost?",
          timestamp: "10:08 AM",
          status: "read",
        },
        {
          id: 4,
          senderId: "me",
          content: "The program runs for 8 weeks and costs $1200. We also offer flexible payment options.",
          timestamp: "10:10 AM",
          status: "read",
        },
        {
          id: 5,
          senderId: "other",
          content: "That sounds great! When can we start?",
          timestamp: "10:15 AM",
          status: "delivered",
        },
      ]);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      senderId: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "delivered" } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "read" } : msg
      ));
    }, 2000);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    {conversation.online && (
                      <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-current" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    {selectedConversation.online && (
                      <Circle className="absolute bottom-0 right-0 w-2.5 h-2.5 text-green-500 fill-current" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.online ? "Active now" : "Offline"} • {selectedConversation.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === "me"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.senderId === "me" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.senderId === "me" && (
                          <>
                            {message.status === "sent" && <Check className="w-3 h-3" />}
                            {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                            {message.status === "read" && <CheckCheck className="w-3 h-3 text-blue-300" />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
