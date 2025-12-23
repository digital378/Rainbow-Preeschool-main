import { Card, CardContent } from "@/components/ui/card";
import { WhyChooseUs } from "@/components/why-choose-us";
import { MethodologySection } from "@/components/methodology-section";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { Eye, Rocket, Star, Calendar } from "lucide-react";
import heroImage from "@assets/16_1766236394926.jpg";

const milestones = [
  { year: "2007", title: "Founded", description: "Rainbow Preschool started with a vision to provide quality early education" },
  { year: "2010", title: "Expansion", description: "Opened second centre to serve more families in Thane" },
  { year: "2015", title: "10,000 Students", description: "Reached milestone of educating over 10,000 young learners" },
  { year: "2020", title: "Digital Learning", description: "Successfully adapted to online learning during the pandemic" },
  { year: "2023", title: "6 Centres", description: "Expanded to 6 centres across Thane West" },
  { year: "2024", title: "50,000+ Alumni", description: "Celebrated over 50,000 students completing their preschool journey" },
];

const visionMission = [
  { 
    icon: Eye, 
    title: "Vision", 
    description: "We aspire to live in a society where education and learning means thinking deeply about the purpose of life, sharing freedom, and spreading hope within families, communities, and throughout the globe. We hope the generations emerging out of our preschools & school will create such an inspiring society." 
  },
  { 
    icon: Rocket, 
    title: "Mission", 
    description: "Our mission is to cultivate a community of parents and educators who collaborate to give children a secure, energizing and supportive environment which enables them to develop and learn." 
  },
];

export default function About() {
  return (
    <div className="pt-20">
      <SEO
        title="About Us - Rainbow Preschool International | Best Preschool in Thane Since 2007"
        description="Learn about Rainbow Preschool International, Thane's trusted preschool since 2007. 50,000+ alumni, 6 centres, play-based learning approach. Discover our vision, mission & story."
        keywords="about rainbow preschool, best preschool thane, preschool history thane, early childhood education thane, play-based learning, preschool thane west, preschool near me, best nursery school, top preschools india, child care center, toddler school, pre primary school, montessori school thane"
        canonical="https://rainbowpreschools.com/about"
      />
      {/* Hero Section */}
      <section className="py-24 md:py-32 lg:py-40 flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Rainbow Preschool International was founded in 2007 with a simple yet powerful vision: to provide every child with the best possible start in their educational journey. Over the years, we have grown from a single school to six thriving centres across Thane West.
                </p>
                <p>
                  More than 50,000 young students have completed their Pre-Primary education with us, each one carrying forward the values and skills they learned at Rainbow. Our spontaneous, adaptable, play-based approach helps children learn with joy and confidence while preparing them for primary school.
                </p>
                <p>
                  Today, we continue to evolve and adapt our teaching methods to meet the needs of today's young learners, making us the best preschool in Thane for a strong and happy start to education.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50,000+", label: "Happy Students" },
                { value: "18+", label: "Years of Excellence" },
                { value: "06", label: "Centres in Thane" },
                { value: "4.7", label: "Google Rating", icon: Star },
              ].map((stat, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                      {stat.icon && <stat.icon className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chairperson's Note Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Chairperson's Note</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="italic">
                  "Live as if you were to die tomorrow, Learn as if you were to live forever." – Mahatma Gandhi
                </p>
                <p>
                  Just like our beloved Mahatma Gandhi Ji believed, Learning is essential for an individual's growth. And when we hear the word Learning, the word Education comes to our mind as they both are co-related.
                </p>
                <p>
                  Education is a joint venture: an association between the school and the home to ensure that children become successful in whatever they choose to pursue. Right education materializes out of co-operation among the learners, mentors, parents and the community.
                </p>
                <p>
                  At Rainbow, you, the parents, play a vital role in our journey towards excellence and your contribution is priceless to us.
                </p>
                <p>
                  I assure you that the entire team of Rainbow Preschool International & Rainbow International School helps shape each child into an intelligent, skilled and committed Indian citizen with a global perspective. I look forward to your kind association, valuable support and a healthy rapport that shall assist us in the holistic development of each child.
                </p>
                <p className="pt-4">
                  Yours Sincerely,<br />
                  <span className="font-semibold text-foreground">Mrs. Akila Balbale</span>
                </p>
              </div>
            </div>
            <div>
              {/* Space reserved for chairperson image */}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">Better Future Through Play.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visionMission.map((item, i) => (
              <Card key={i} className="bg-card shadow-sm" data-testid={`card-value-${i}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg">Key milestones in Rainbow Preschool's history.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, i) => (
              <Card key={i} data-testid={`card-milestone-${i}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                  </div>
                  <h3 className="font-semibold text-base mb-2">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <MethodologySection />
      <CTASection />
    </div>
  );
}
