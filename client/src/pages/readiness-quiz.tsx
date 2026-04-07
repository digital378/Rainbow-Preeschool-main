import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Phone, Star, Baby, Users, Brain, MessageCircle, Hand } from "lucide-react";

interface Question {
  id: number;
  text: string;
  category: string;
  icon: typeof Baby;
}

const questions: Question[] = [
  { id: 1, text: "Can your child walk and move around independently?", category: "Physical", icon: Hand },
  { id: 2, text: "Can your child sit and focus on an activity (like a story or puzzle) for at least 3-5 minutes?", category: "Physical", icon: Hand },
  { id: 3, text: "Does your child show interest in other children — watching them, approaching them, or playing alongside them?", category: "Social", icon: Users },
  { id: 4, text: "Can your child separate from you for short periods (30-60 minutes) without extreme distress?", category: "Social", icon: Users },
  { id: 5, text: "Does your child use at least a few words or gestures to communicate basic needs (hunger, thirst, discomfort)?", category: "Communication", icon: MessageCircle },
  { id: 6, text: "Does your child respond to their name and understand simple instructions like 'come here' or 'sit down'?", category: "Communication", icon: MessageCircle },
  { id: 7, text: "Does your child show curiosity about new environments — exploring new rooms, touching new objects, looking around?", category: "Cognitive", icon: Brain },
  { id: 8, text: "Can your child feed themselves (even if messily) with fingers or a spoon?", category: "Independence", icon: Star },
  { id: 9, text: "Does your child show interest in songs, rhymes, or stories — even if they can't follow the whole thing?", category: "Cognitive", icon: Brain },
  { id: 10, text: "Is your child between 1.5 and 6 years old?", category: "Age", icon: Baby },
];

const categoryIcons: Record<string, typeof Baby> = {
  Physical: Hand,
  Social: Users,
  Communication: MessageCircle,
  Cognitive: Brain,
  Independence: Star,
  Age: Baby,
};

function getResult(score: number) {
  if (score >= 8) {
    return {
      title: "Your Child is Ready for Preschool!",
      emoji: "🎉",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Based on your answers, your child shows strong readiness signs for a structured preschool programme. They have the physical, social, and communication foundations to thrive in an early learning environment.",
      recommendation: "We recommend enrolling your child in a quality preschool programme. At Rainbow Preschool International, our Playgroup (1.5-2.5 years), Nursery (2.5-4 years), and Kindergarten (4-6 years) programmes are designed to nurture each child's unique developmental stage.",
      cta: "Schedule a Visit Today",
    };
  }
  if (score >= 5) {
    return {
      title: "Your Child is Almost Ready!",
      emoji: "🌟",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Your child is showing many readiness signs but may benefit from a little more time or a gentle introduction. This is perfectly normal — every child develops at their own pace.",
      recommendation: "Consider a shorter playgroup programme (2-3 hours) to help your child build confidence gradually. Rainbow Preschool's Playgroup programme is designed specifically for this transition, with small batch sizes of 10-12 children and trained teachers who specialise in helping young children adjust.",
      cta: "Talk to Our Educators",
    };
  }
  return {
    title: "Give It a Little More Time",
    emoji: "💛",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Based on your answers, your child may benefit from a bit more time before starting preschool. This is completely okay — there's no rush, and starting when your child is ready leads to a much better experience for everyone.",
    recommendation: "Focus on building the skills at home through play, social interactions with other children, and gradual exposure to new environments. When you feel your child is ready, Rainbow Preschool International will be here to welcome them warmly.",
    cta: "Get Parenting Tips",
  };
}

export default function ReadinessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showResult, setShowResult] = useState(false);

  const progress = Object.keys(answers).length;
  const score = Object.values(answers).filter(Boolean).length;
  const result = getResult(score);
  const question = questions[currentQuestion];
  const CategoryIcon = categoryIcons[question.category];

  const handleAnswer = (answer: boolean) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEO
        title="Is My Child Ready for Preschool? Free Readiness Quiz | Rainbow Preschool"
        description="Take this free 2-minute quiz to find out if your child is ready for preschool. 10 research-backed questions covering physical, social, and cognitive readiness."
        keywords="preschool readiness quiz, is my child ready for preschool, preschool readiness checklist, child development assessment, preschool readiness test"
        canonical="https://www.rainbowpreschools.com/preschool-readiness-quiz"
      />

      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="quiz-badge">
            Free 2-Minute Assessment
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Is My Child Ready for Preschool?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Answer 10 simple questions about your child's development to find out if they're ready for a structured learning environment.
          </p>
        </div>

        {!showResult ? (
          <Card className="border-2 shadow-lg" data-testid="quiz-card">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  question.category === "Physical" ? "bg-orange-50 text-orange-700" :
                  question.category === "Social" ? "bg-blue-50 text-blue-700" :
                  question.category === "Communication" ? "bg-purple-50 text-purple-700" :
                  question.category === "Cognitive" ? "bg-green-50 text-green-700" :
                  question.category === "Independence" ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  <CategoryIcon className="w-3 h-3" />
                  {question.category}
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  data-testid="quiz-progress-bar"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed text-center">
                {question.text}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => handleAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 min-w-[160px] text-lg py-6"
                  data-testid="quiz-answer-yes"
                >
                  <CheckCircle className="w-5 h-5" />
                  Yes
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 gap-2 min-w-[160px] text-lg py-6"
                  data-testid="quiz-answer-no"
                >
                  <XCircle className="w-5 h-5" />
                  Not Yet
                </Button>
              </div>

              {currentQuestion > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleBack}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    data-testid="quiz-back-button"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Previous question
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div data-testid="quiz-result">
            <Card className={`border-2 ${result.borderColor} shadow-lg mb-8`}>
              <CardContent className={`p-6 sm:p-8 ${result.bgColor}`}>
                <div className="text-center mb-6">
                  <span className="text-5xl mb-4 block">{result.emoji}</span>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${result.color} mb-2`}>
                    {result.title}
                  </h2>
                  <p className="text-lg text-gray-600">
                    Your child scored {score} out of {questions.length} readiness indicators
                  </p>
                </div>

                <div className="bg-white/80 rounded-lg p-5 mb-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {result.description}
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {result.recommendation}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {Object.entries(
                    questions.reduce((acc, q, i) => {
                      if (!acc[q.category]) acc[q.category] = { yes: 0, total: 0 };
                      acc[q.category].total++;
                      if (answers[i]) acc[q.category].yes++;
                      return acc;
                    }, {} as Record<string, { yes: number; total: number }>)
                  ).map(([category, { yes, total }]) => (
                    <div key={category} className="bg-white rounded-lg p-3 text-center border">
                      <p className="text-xs text-muted-foreground mb-1">{category}</p>
                      <p className={`text-lg font-bold ${yes === total ? "text-green-600" : yes > 0 ? "text-amber-600" : "text-red-500"}`}>
                        {yes}/{total}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2 w-full sm:w-auto" data-testid="quiz-cta-contact">
                      <Phone className="w-4 h-4" />
                      {result.cta}
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2"
                    data-testid="quiz-reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Take Quiz Again
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answers Summary</h3>
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-3">
                      {answers[i] ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm text-gray-700">{q.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Helpful Resources</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/blog/what-age-start-play-school" className="flex items-center gap-2 p-3 rounded-lg border hover:border-red-300 hover:shadow-sm transition-all text-sm text-gray-700" data-testid="link-quiz-age-guide">
                  <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0" />
                  What Age Should a Child Start Play School?
                </Link>
                <Link href="/blog/benefits-play-school-2-year-olds" className="flex items-center gap-2 p-3 rounded-lg border hover:border-red-300 hover:shadow-sm transition-all text-sm text-gray-700" data-testid="link-quiz-benefits">
                  <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0" />
                  Benefits of Play School for 2 Year Olds
                </Link>
                <Link href="/blog/signs-of-good-preschool-thane" className="flex items-center gap-2 p-3 rounded-lg border hover:border-red-300 hover:shadow-sm transition-all text-sm text-gray-700" data-testid="link-quiz-signs">
                  <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0" />
                  10 Signs of a Good Preschool
                </Link>
                <Link href="/blog/nursery-school-admission-thane-2026" className="flex items-center gap-2 p-3 rounded-lg border hover:border-red-300 hover:shadow-sm transition-all text-sm text-gray-700" data-testid="link-quiz-admission">
                  <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0" />
                  Nursery Admission Guide 2026-27
                </Link>
              </div>
            </div>
          </div>
        )}

        <BlogInternalLinks currentSlug="readiness-quiz" />
      </section>

      <CTASection />
    </article>
  );
}
