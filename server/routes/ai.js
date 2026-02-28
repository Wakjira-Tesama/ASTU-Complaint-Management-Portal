const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// The core knowledge base for the university
const astuKnowledgeBase = {
  registrar: {
    keywords: ["registrar", "lost id", "id card", "grade", "transcript", "admission"],
    response: "For Registrar services (like lost ID, grades, or transcripts):\n1. Send a complaint to the **Registrar Administration** via this portal.\n2. Or visit the Registrar Office in person.\n\n**Contact Info:**\n- Phone: +251-221-100001\n- Email: sar@astu.edu.et"
  },
  studentAffairs: {
    keywords: ["student affairs", "support", "help", "guidance"],
    response: "For general university support or student-related issues, please go to the **Student Affairs Office** or submit a support request here."
  },
  cafeteria: {
    keywords: ["cafeteria", "food", "meal", "hygiene", "menu"],
    response: "To report cafeteria issues or request changes (like menu variety or hygiene):\n1. Go to **New Complaint**\n2. Select **Cafeteria Staff** as the target department.\n3. Submit your feedback directly to them."
  },
  departments: {
    keywords: ["department", "school", "major", "engineering", "science", "business"],
    response: "ASTU has several specialized schools:\n- **Applied Natural Sciences** (Applied Physics, Chemistry, Geology, etc.)\n- **Electrical Engineering & Computing** (Computer Science, Electrical Power, Electronics)\n- **Civil Engineering & Architecture**\n- **Mechanical, Chemical and Materials Engineering**\n- **Business School**\n\nFor more details, visit: [www.astu.edu.et/schools](https://www.astu.edu.et)"
  },
  complaints: {
    keywords: ["submit", "complaint", "new", "issue", "report"],
    response: "To submit a complaint:\n1. Go to **My Complaints** from the sidebar\n2. Click **New Complaint**\n3. Select the department category\n4. Describe your issue in detail\n5. Click Submit\n\nYour complaint will be automatically routed to the right department!"
  },
  tracking: {
    keywords: ["status", "track", "progress"],
    response: "You can track your complaints in the **My Complaints** page. Each ticket shows its current status:\n- **Pending**: Awaiting staff review\n- **In Progress**: Being addressed\n- **Resolved**: Issue fixed\n- **Rejected**: Cannot be addressed"
  },
  resolutionTime: {
    keywords: ["long", "time", "resolution", "how many days"],
    response: "Average resolution time is **2.3 days**. Urgent issues like water or electricity are typically resolved within **24 hours**. Academic complaints may take **3-5 days** depending on complexity."
  },
  dormitory: {
    keywords: ["dormitory", "dorm", "water", "electricity", "repair"],
    response: "Dormitory issues (water, electricity, room repairs) are handled by **Dormitory Staff**. They receive your complaint automatically when you select 'Dormitory' as the category."
  },
  greetings: {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello! 👋 I'm your ASTU AI assistant. I can help you with:\n- Lost ID or Registrar queries\n- Campus service support (Cafeteria, Dorms)\n- Department information\n- Complaint submission & tracking\n\nHow can I help you today?"
  }
};

// Simple keyword matching engine
const generateResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Find the first matching category
  for (const [key, category] of Object.entries(astuKnowledgeBase)) {
    if (category.keywords.some(keyword => lowerMsg.includes(keyword))) {
      return category.response;
    }
  }

  // Fallback response
  return "I can help you with ASTU services, department info, and complaint tracking. Try asking about:\n- What to do if I lost my ID?\n- How to contact the Registrar?\n- Cafeteria issues\n- Submitting a complaint";
};

// Route to handle AI queries
// using POST to allow passing complex message history if needed in the future
router.post("/query", auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const responseText = generateResponse(message);
    
    // In the future, this is where we would call an external LLM API (like OpenAI)
    // or perform dynamic database queries based on the user's role (req.user)
    
    res.json({ reply: responseText });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Failed to process AI query" });
  }
});

module.exports = router;
