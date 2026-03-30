import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { trackFormSubmit } from "@/lib/analytics";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  quickReplies?: { label: string; value: string }[];
  isForm?: boolean;
}

const PHONE_NUMBER = "918291568972";

const MAIN_MENU_REPLIES = [
  { label: "Our Programmes", value: "programmes" },
  { label: "Timings & Batches", value: "timings" },
  { label: "Our Centres", value: "centres" },
  { label: "Admissions Process", value: "admissions" },
  { label: "Fees", value: "fees" },
  { label: "Safety & Staff", value: "safety" },
  { label: "Talk to Someone", value: "enquire" },
];

const BACK_REPLY = { label: "⬅ Main Menu", value: "main_menu" };

const BOT_RESPONSES: Record<string, { text: string; quickReplies?: { label: string; value: string }[] }> = {
  main_menu: {
    text: "Sure! Here's what I can help you with:",
    quickReplies: MAIN_MENU_REPLIES,
  },
  programmes: {
    text: "We offer three core programmes at Rainbow Preschool International:\n\n🟡 Playgroup — Ages 1.5 to 2.5 years\n🔴 Nursery — Ages 2.5 to 3.5 years\n🟢 Kindergarten (Jr. KG & Sr. KG) — Ages 3.5 to 5.5 years\n\nAll programmes are play-based, with 100% female staff and small batch sizes for personal attention.",
    quickReplies: [
      { label: "Timings & Batches", value: "timings" },
      { label: "Admissions Process", value: "admissions" },
      { label: "Enquire Now", value: "enquire" },
      BACK_REPLY,
    ],
  },
  timings: {
    text: "Our centres typically run two batches:\n\n⏰ Morning Batch — 8:30 AM to 12:30 PM\n⏰ Afternoon Batch — 12:30 PM to 4:30 PM\n\nBatch availability varies by centre and programme. Contact your nearest centre for exact timings.",
    quickReplies: [
      { label: "Find a Centre", value: "centres" },
      { label: "Our Programmes", value: "programmes" },
      { label: "Enquire Now", value: "enquire" },
      BACK_REPLY,
    ],
  },
  centres: {
    text: "We have 6 centres across Thane:\n\n📍 Manpada — Aggarwal Arcade, near Khewra Circle\n📍 Hariniwas — M.V. Apartments, Bhakti Mandir Road\n📍 Anand Nagar — Kris Commercial Plaza, opp. Tropical Lagoon\n📍 Dhokali — Kolshet Road, opp. Aban Park\n📍 Kalwa — near Sayba Hall, Manisha Nagar\n📍 Kasarvadavali — Rosa Gardenia, behind Hypercity Mall",
    quickReplies: [
      { label: "Admissions Process", value: "admissions" },
      { label: "Enquire Now", value: "enquire" },
      BACK_REPLY,
    ],
  },
  admissions: {
    text: "Admissions at Rainbow Preschool are simple:\n\n1️⃣ Fill in the enquiry form (or tell me below!)\n2️⃣ We'll call you to schedule a centre visit\n3️⃣ Meet our team, see the classroom\n4️⃣ Complete registration with documents\n\nDocuments needed: Birth certificate, 2 passport photos, address proof.",
    quickReplies: [
      { label: "Enquire Now", value: "enquire" },
      { label: "Our Centres", value: "centres" },
      { label: "Our Programmes", value: "programmes" },
      BACK_REPLY,
    ],
  },
  fees: {
    text: "Our fees are competitive and value-for-money for the quality of education we provide.\n\nFee details vary by programme and batch. We'd love to share the full fee structure during your centre visit or over a call. Would you like us to get in touch?",
    quickReplies: [
      { label: "Yes, Call Me", value: "enquire" },
      { label: "Our Programmes", value: "programmes" },
      { label: "Our Centres", value: "centres" },
      BACK_REPLY,
    ],
  },
  safety: {
    text: "Your child's safety is our top priority:\n\n✅ 100% Female teaching staff\n✅ CCTV surveillance at all centres\n✅ Controlled entry — only authorised adults\n✅ All staff trained in first aid\n✅ Child-proofed classrooms (rounded edges, covered outlets)\n✅ Regular sanitisation and hygiene checks\n\nWe've been trusted by 1 lakh+ families since 2007.",
    quickReplies: [
      { label: "Our Programmes", value: "programmes" },
      { label: "Enquire Now", value: "enquire" },
      BACK_REPLY,
    ],
  },
  enquire: {
    text: "I'd love to help! Please share a few details and our team will call you within 24 hours. 👇",
    quickReplies: [],
  },
};

const WELCOME_MESSAGES: Message[] = [
  {
    id: "w1",
    sender: "bot",
    text: "Hi there! 👋 I'm Priya, your Rainbow Preschool assistant.\n\nHow can I help you today?",
    quickReplies: MAIN_MENU_REPLIES,
  },
];

const AGE_OPTIONS = [
  "1.5 - 2.5 years (Playgroup)",
  "2.5 - 3.5 years (Nursery)",
  "3.5 - 4.5 years (Jr. KG)",
  "4.5 - 5.5 years (Sr. KG)",
  "Not sure yet",
];

const AREA_OPTIONS = [
  "Manpada",
  "Hariniwas",
  "Anand Nagar",
  "Dhokali",
  "Kalwa",
  "Kasarvadavali",
  "Not sure / Other",
];

const PROGRAMME_MAP: Record<string, string> = {
  "1.5 - 2.5 years (Playgroup)": "Playgroup",
  "2.5 - 3.5 years (Nursery)": "Nursery",
  "3.5 - 4.5 years (Jr. KG)": "Kindergarten",
  "4.5 - 5.5 years (Sr. KG)": "Kindergarten",
  "Not sure yet": "Not sure",
};

function BotTypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">P</div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function LeadForm({ onSubmit, isSubmitting }: {
  onSubmit: (data: { name: string; phone: string; childAge: string; area: string }) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [childAge, setChildAge] = useState("");
  const [area, setArea] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter a valid 10-digit mobile number";
    if (!childAge) e.childAge = "Please select child's age";
    if (!area) e.area = "Please select a centre area";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting && validate()) onSubmit({ name, phone, childAge, area });
  };

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white";
  const errClass = "text-xs text-red-500 mt-0.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 mt-1">
      <div>
        <input
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={e => setName(e.target.value)}
          className={inputClass}
          data-testid="chatbot-input-name"
          disabled={isSubmitting}
        />
        {errors.name && <p className={errClass}>{errors.name}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Mobile number *"
          value={phone}
          maxLength={10}
          onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
          className={inputClass}
          data-testid="chatbot-input-phone"
          disabled={isSubmitting}
        />
        {errors.phone && <p className={errClass}>{errors.phone}</p>}
      </div>
      <div>
        <select
          value={childAge}
          onChange={e => setChildAge(e.target.value)}
          className={`${inputClass} text-gray-600`}
          data-testid="chatbot-select-age"
          disabled={isSubmitting}
        >
          <option value="">Child's age group *</option>
          {AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.childAge && <p className={errClass}>{errors.childAge}</p>}
      </div>
      <div>
        <select
          value={area}
          onChange={e => setArea(e.target.value)}
          className={`${inputClass} text-gray-600`}
          data-testid="chatbot-select-area"
          disabled={isSubmitting}
        >
          <option value="">Preferred centre area *</option>
          {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.area && <p className={errClass}>{errors.area}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        data-testid="chatbot-button-submit"
      >
        {isSubmitting ? "Sending…" : "Request a Callback"}
      </button>
    </form>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setHasUnread(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const addBotMessage = (key: string) => {
    const response = BOT_RESPONSES[key];
    if (!response) return;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMsg: Message = {
        id: `${Date.now()}-bot`,
        sender: "bot",
        text: response.text,
        quickReplies: key === "enquire" ? [] : response.quickReplies,
        isForm: key === "enquire",
      };
      setMessages(prev => [...prev, newMsg]);
    }, 900);
  };

  const handleQuickReply = (label: string, value: string) => {
    if (value === "main_menu") {
      const userMsg: Message = { id: `${Date.now()}-user`, sender: "user", text: label };
      setMessages(prev => prev.map(m => ({ ...m, quickReplies: undefined })).concat(userMsg));
      addBotMessage("main_menu");
      return;
    }
    const userMsg: Message = { id: `${Date.now()}-user`, sender: "user", text: label };
    setMessages(prev => prev.map(m => ({ ...m, quickReplies: undefined })).concat(userMsg));
    addBotMessage(value);
  };

  const handleFormSubmit = async (data: { name: string; phone: string; childAge: string; area: string }) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/contact", {
        parentName: data.name,
        phone: data.phone,
        childName: "Not Provided",
        childAge: data.childAge,
        programme: PROGRAMME_MAP[data.childAge] || "Not sure",
        branch: data.area,
        message: `Chat widget enquiry. Preferred centre: ${data.area}`,
        leadSource: "Chatbot",
        leadMedium: "Website Chat Widget",
      });
      const json = await res.json();
      if (json.success) {
        trackFormSubmit({ formType: "default", parentName: data.name, phone: data.phone, childAge: data.childAge, leadSource: "Chatbot" });
        setFormSubmitted(true);
        const successMsg: Message = {
          id: `${Date.now()}-success`,
          sender: "bot",
          text: `Thank you, ${data.name}! 🎉\n\nOur team will call you at ${data.phone} within 24 hours.\n\nIn the meantime, feel free to explore our programmes or WhatsApp us directly.`,
          quickReplies: [
            { label: "Our Programmes", value: "programmes" },
            { label: "Our Centres", value: "centres" },
            BACK_REPLY,
          ],
        };
        setMessages(prev =>
          prev.map(m => (m.isForm ? { ...m, isForm: false } : m)).concat(successMsg)
        );
      } else {
        throw new Error("Server returned failure");
      }
    } catch {
      const errMsg: Message = {
        id: `${Date.now()}-err`,
        sender: "bot",
        text: "Oops! Something went wrong. Please try WhatsApp or call us directly at 82915 68972.",
        quickReplies: [BACK_REPLY],
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBotText = (text: string) => {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-[148px] md:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] md:h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          data-testid="chatbot-window"
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">P</div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Priya</p>
                <p className="text-white/80 text-xs">Rainbow Preschool Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${PHONE_NUMBER}?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                title="Open WhatsApp"
                data-testid="chatbot-whatsapp-link"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                data-testid="chatbot-button-close"
                aria-label="Close chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.sender === "bot" ? (
                  <div className="flex items-end gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">P</div>
                    <div className="max-w-[85%]">
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-sm text-gray-800 leading-relaxed">
                        {renderBotText(msg.text)}
                        {msg.isForm && !formSubmitted && (
                          <div className="mt-3 border-t border-gray-100 pt-3">
                            <LeadForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                          </div>
                        )}
                      </div>
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.quickReplies.map(qr => (
                            <button
                              key={qr.value}
                              onClick={() => handleQuickReply(qr.label, qr.value)}
                              className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors font-medium"
                              data-testid={`chatbot-quickreply-${qr.value}`}
                            >
                              {qr.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end mb-3">
                    <div className="max-w-[78%] bg-primary text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && <BotTypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-white flex-shrink-0">
            <p className="text-[11px] text-center text-gray-400">
              Rainbow Preschool International · Thane · Since 2007
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_4px_16px_rgba(220,38,38,0.45)] hover:bg-primary/90 hover:shadow-[0_6px_20px_rgba(220,38,38,0.55)] transition-all duration-300 hover:-translate-y-0.5"
        data-testid="chatbot-button-toggle"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
