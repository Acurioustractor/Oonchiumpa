import React from "react";
import { Section } from "../components/Section";
import { Card, CardBody } from "../components/Card";
import {
  CirclePattern,
  DotPattern,
  SpiralPattern,
} from "../design-system/symbols";

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Kristy Bloomfield",
      role: "Director & Traditional Owner",
      tribe: "Central & Eastern Arrernte Woman",
      description:
        "Leading with cultural authority as a Traditional Owner of Mparntwe (Alice Springs), Kristy brings deep connection to Country and community. Her vision has transformed youth diversion in Central Australia.",
      image: "/images/team/kristy.jpg",
      quote: "We're not just changing young lives - we're reclaiming our community, our culture, and our future."
    },
    {
      name: "Tanya Turner",
      role: "Legal Advocate & Community Educator",
      tribe: "Eastern Arrernte Woman",
      description:
        "UWA law graduate, former Supreme Court Associate, and passionate advocate. Tanya combines professional legal excellence with deep cultural knowledge to create pathways for justice and healing.",
      image: "/images/team/tanya.jpg",
      quote: "These kids aren't the problem - they're collateral in a bigger issue. We're here to change that system."
    },
  ];

  const impactStats = [
    {
      number: "95%",
      label: "Diversion Success",
      description: "Of youth diverted from justice system",
      icon: "shield"
    },
    {
      number: "97.6%",
      label: "More Cost-Effective",
      description: "Than youth detention",
      icon: "dollar"
    },
    {
      number: "100%",
      label: "Aboriginal Employment",
      description: "Led by Arrernte Traditional Owners",
      icon: "users"
    },
    {
      number: "72%",
      label: "Returned to Education",
      description: "After disengagement from school",
      icon: "book"
    },
    {
      number: "30+",
      label: "Youth Supported",
      description: "From 7 language groups",
      icon: "heart"
    },
    {
      number: "90%",
      label: "Retention Rate",
      description: "Young people engaged consistently",
      icon: "check"
    },
  ];

  const values = [
    {
      title: "Cultural Authority",
      description: "We lead from Country. As Traditional Owners of Mparntwe, we hold the cultural authority that makes our work uniquely effective. Young people feel deep responsibility to us - they don't want to let us down.",
      icon: "⚫",
      color: "ochre"
    },
    {
      title: "Aboriginal-Led Solutions",
      description: "100% Aboriginal employment isn't just a statistic - it's our foundation. Aboriginal people want to work with Aboriginal people. Our young people thrive with role models who understand their lived experience.",
      icon: "🤝",
      color: "eucalyptus"
    },
    {
      title: "Holistic Approach",
      description: "We see the whole person, the whole family, the whole community. From housing and food security to cultural healing and education - we address root causes, not just symptoms.",
      icon: "🔄",
      color: "sunset"
    },
    {
      title: "Two Worlds, One Future",
      description: "Our motto: 'Two Cultures, One World, Working Together.' We equip young people to navigate both Aboriginal and Western worlds with strength, pride, and practical skills.",
      icon: "🌏",
      color: "sky"
    },
  ];

  const recognitionItems = [
    {
      title: "NIAA Funding",
      description: "Secured National Indigenous Australians Agency funding as a proven model for youth diversion"
    },
    {
      title: "Operation Luna Success",
      description: "Of 21 young people on NT Police Operation Luna list, only 1 remained by December 2024"
    },
    {
      title: "National Model",
      description: "Recognized as a scalable model for Aboriginal-led youth services across Australia"
    },
    {
      title: "Research Partnership",
      description: "Partnering with Flinders University to establish best practices for culturally-grounded youth work"
    },
  ];

  return (
    <>
      {/* Hero Section - Immediate Emotional Connection */}
      <Section className="bg-gradient-to-br from-sand-50 via-ochre-50 to-eucalyptus-50 pt-24 pb-12">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-earth-900 mb-6 leading-tight">
            The Power of <span className="text-gradient">Cultural Authority</span>
          </h1>
          <p className="text-xl md:text-2xl text-earth-700 mb-8 leading-relaxed">
            What happens when Traditional Owners lead youth diversion?
            <br />
            <strong className="text-earth-900">95% diversion success. 97.6% more cost-effective than detention. 100% Aboriginal-led.</strong>
          </p>
          <p className="text-lg md:text-xl text-earth-600 max-w-3xl mx-auto leading-relaxed">
            Oonchiumpa isn't another youth program. We're Traditional Owners reclaiming our community through cultural authority, family connection, and the simple truth that Aboriginal kids thrive when led by Aboriginal people.
          </p>
        </div>
      </Section>

      {/* The Problem We're Solving */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-6 text-center">
            The Crisis Behind The Headlines
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-earth-700 leading-relaxed mb-6">
              Alice Springs makes national news for all the wrong reasons. Young Aboriginal people portrayed as problems, not children in crisis. What the media doesn't show: the overcrowding, the hunger, the lack of safe places to sleep, the absence of culturally-grounded support.
            </p>
            <div className="bg-earth-50 border-l-4 border-ochre-500 p-6 my-8">
              <p className="text-lg text-earth-800 italic">
                "Unfortunately, a lot of our young people do not have the opportunity that we grew up with. They're living in overcrowding, eating whatever food they can find, sleeping wherever there's space. They're out on the streets because there's nowhere else to go."
              </p>
              <p className="text-sm text-earth-600 mt-2">- Kristy Bloomfield, Director</p>
            </div>
            <p className="text-xl text-earth-700 leading-relaxed">
              These aren't "bad kids" - they're children without basics many Australians take for granted. The system responds with detention that costs millions and changes nothing. We respond with cultural connection, practical support, and the authority that comes from being their Elders, their Traditional Owners, their family.
            </p>
          </div>
        </div>
      </Section>

      {/* Our Origin Story */}
      <Section className="bg-earth-50">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold text-earth-900">
              Born From Necessity, Built on Strength
            </h2>
            <div className="space-y-4 text-earth-700 leading-relaxed">
              <p className="text-lg">
                In 2022, Kristy Bloomfield saw what everyone else saw - young Aboriginal people filling the justice system, making headlines, being failed by programs designed without cultural understanding. But as a Traditional Owner and director, she saw something else: the solution.
              </p>
              <p className="text-lg">
                Working initially under NAAJA (North Australian Aboriginal Justice Agency), Kristy and Tanya Turner began something different. Not another well-meaning program, but leadership rooted in cultural authority, family connections, and the deep truth that these are their kids, their Country, their responsibility.
              </p>
              <p className="text-lg">
                The results were immediate. Young people who'd burned bridges with every other service responded to cultural authority. Families who'd given up found hope. The NT Police Operation Luna taskforce saw their list of high-risk youth shrink dramatically.
              </p>
              <p className="text-lg font-semibold text-earth-900">
                By 2023, Oonchiumpa became independent - a 100% Aboriginal-led organization proving what happens when the right people lead the work.
              </p>
            </div>
          </div>
          <div className="relative">
            {/* Visual Story Timeline */}
            <div className="space-y-6">
              {/* 2022 - Foundation */}
              <div className="relative pl-8 border-l-4 border-ochre-400 pb-6">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-ochre-500 border-4 border-white"></div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-sm font-semibold text-ochre-600 mb-2">2022</div>
                  <h3 className="text-lg font-bold text-earth-900 mb-2">Foundation Under NAAJA</h3>
                  <p className="text-earth-700 text-sm">
                    Kristy Bloomfield establishes culturally-led youth diversion program. Recognition that young people needed Traditional Owner leadership and community-based support, not detention.
                  </p>
                </div>
              </div>

              {/* 2023 - Independence & Growth */}
              <div className="relative pl-8 border-l-4 border-eucalyptus-400 pb-6">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-eucalyptus-500 border-4 border-white"></div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-sm font-semibold text-eucalyptus-600 mb-2">2023</div>
                  <h3 className="text-lg font-bold text-earth-900 mb-2">Independence & Rapid Growth</h3>
                  <p className="text-earth-700 text-sm">
                    Oonchiumpa becomes independent organization. Expanded from 14 to 30+ participants. Built partnerships with 30+ organizations. Proven 95% diversion success rate from justice system.
                  </p>
                </div>
              </div>

              {/* 2024 - National Recognition */}
              <div className="relative pl-8 border-l-4 border-sunset-400 pb-6">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-sunset-500 border-4 border-white"></div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-sm font-semibold text-sunset-600 mb-2">2024</div>
                  <h3 className="text-lg font-bold text-earth-900 mb-2">National Recognition</h3>
                  <p className="text-earth-700 text-sm">
                    NIAA funding secured. Recognized as national model for Aboriginal-led youth diversion. Research shows 97.6% more cost-effective than detention. Of 21 Operation Luna youth, only 1 remained on list by December.
                  </p>
                </div>
              </div>

              {/* 2025 - Scaling Impact */}
              <div className="relative pl-8 border-l-4 border-sky-400">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-sky-500 border-4 border-white"></div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-sm font-semibold text-sky-600 mb-2">2025 & Beyond</div>
                  <h3 className="text-lg font-bold text-earth-900 mb-2">Scaling the Model</h3>
                  <p className="text-earth-700 text-sm">
                    Building sustainable pathways through education, employment, and cultural connection. Developing Oonchiumpa Hub - one-stop culturally-safe space for youth, families, and communities. Sharing model nationally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Our Unique Approach - What Makes Us Different */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4">
            Why Cultural Authority Changes Everything
          </h2>
          <p className="text-xl text-earth-700 max-w-3xl mx-auto">
            Our success isn't accidental. It's the result of Aboriginal leadership, cultural connection, and practical support meeting young people where they are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {values.map((value, index) => (
            <Card key={index}>
              <CardBody className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={`text-4xl flex-shrink-0 w-16 h-16 rounded-full bg-${value.color}-100 flex items-center justify-center`}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-earth-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-earth-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* What We Actually Do */}
        <div className="bg-gradient-to-br from-eucalyptus-50 to-sand-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-display font-bold text-earth-900 mb-6 text-center">
            What This Looks Like In Practice
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-earth-900 mb-3 text-lg">Cultural Brokerage</h4>
              <p className="text-earth-700">
                Connecting young people with Aboriginal-led programs, businesses, and services across Central Australia. Every referral maintains cultural connection and builds identity.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-earth-900 mb-3 text-lg">Basic Needs Support</h4>
              <p className="text-earth-700">
                Housing assistance, food security, health appointments, Centrelink navigation, birth certificates. The basics that enable everything else.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-earth-900 mb-3 text-lg">Education Pathways</h4>
              <p className="text-earth-700">
                School enrollment, daily pickup support, in-class assistance, alternative education options. 72% of disengaged youth returned to education.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-earth-900 mb-3 text-lg">On Country Programs</h4>
              <p className="text-earth-700">
                Cultural camps, connection to Elders, learning traditional knowledge, understanding identity. The foundation that changes lives.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-earth-900 mb-3 text-lg">Justice System Navigation</h4>
              <p className="text-earth-700">
                Court support, bail assistance, legal advocacy. Professional expertise meeting cultural understanding.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-earth-900 mb-3 text-lg">Family Engagement</h4>
              <p className="text-earth-700">
                Working with whole kinship systems. Supporting parents and siblings. Building protective networks around vulnerable youth.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Impact & Outcomes - The Numbers That Matter */}
      <Section className="bg-earth-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4">
            Impact That Speaks For Itself
          </h2>
          <p className="text-xl text-earth-700 max-w-3xl mx-auto">
            These aren't just statistics - they're young lives transformed, families reunited, futures reclaimed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-earth-900 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-earth-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Real Stories */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h3 className="text-3xl font-display font-bold text-earth-900 mb-6 text-center">
            Stories of Transformation
          </h3>

          <Card>
            <CardBody className="p-8">
              <p className="text-lg text-earth-700 leading-relaxed italic mb-4">
                "MS stated that they were from Alice Springs on first engagement. However, after talking about their family connections, language and cultural ties, the young person learnt that they had many family connections throughout Central Australia. Oonchiumpa was able to link MS with other family members. With our support, MS subsequently went on to develop close positive and meaningful relationships with these family members. MS hasn't re-offended since and we were able to close their file."
              </p>
              <p className="text-sm text-earth-600">- Case study from evaluation report</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-8">
              <p className="text-lg text-earth-700 leading-relaxed italic mb-4">
                "I think other kids should work with you mob; I think everyone should work with Oonchiumpa. I like working with you because you mob are good and help, it's good working with you mob."
              </p>
              <p className="text-sm text-earth-600">- Young person in program</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-8">
              <p className="text-lg text-earth-700 leading-relaxed italic mb-4">
                "You know I try get these kids up for school every day, try to wake them up to come with me but nothing, they don't get up. You mob come see them, they up straight away. It's good, they listen, get up straight away and get ready."
              </p>
              <p className="text-sm text-earth-600">- Family member</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-8">
              <p className="text-lg text-earth-700 leading-relaxed italic mb-4">
                "CB understands since becoming a man he has more responsibility and is now becoming more of a role model and leader in the Town Camp. He didn't understand the importance of his cultural role before. He is now able to reflect on his actions in the past and feeling remorse. He knows he can be a leader."
              </p>
              <p className="text-sm text-earth-600">- Oonchiumpa Team Leader observation</p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* The Team - The People Behind The Impact */}
      <Section id="team">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4">
            Led by Traditional Owners
          </h2>
          <p className="text-xl text-earth-700 max-w-3xl mx-auto">
            This isn't just our work - it's our Country, our people, our responsibility. Our leadership comes from cultural authority, professional expertise, and deep love for our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-ochre-100 to-eucalyptus-100 flex items-center justify-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-ochre-200 rounded-full flex items-center justify-center">
                      <span className="text-ochre-700 text-3xl font-semibold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="text-earth-600 text-sm">
                      Team Photo Coming Soon
                    </span>
                  </div>
                )}
              </div>
              <CardBody className="p-8">
                <h3 className="text-2xl font-semibold text-earth-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-ochre-600 font-semibold mb-2">{member.tribe}</p>
                <p className="text-eucalyptus-600 font-medium mb-4">{member.role}</p>
                <p className="text-earth-700 leading-relaxed mb-4">
                  {member.description}
                </p>
                {member.quote && (
                  <div className="border-l-4 border-ochre-400 pl-4 py-2 bg-sand-50 rounded">
                    <p className="text-earth-700 italic text-sm">"{member.quote}"</p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Broader Team Context */}
        <div className="bg-gradient-to-br from-sand-50 to-earth-50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-display font-bold text-earth-900 mb-4 text-center">
            Building Aboriginal Leadership
          </h3>
          <p className="text-lg text-earth-700 leading-relaxed text-center mb-6">
            Beyond our directors, Oonchiumpa employs Aboriginal youth workers, cultural mentors, and support staff. We're not just helping young people - we're creating employment pathways for their role models. 100% Aboriginal employment means every interaction reinforces identity and possibility.
          </p>
          <div className="flex items-center justify-center space-x-4 pt-4">
            <DotPattern className="w-8 h-8 text-ochre-500" />
            <CirclePattern className="w-8 h-8 text-eucalyptus-500" />
            <SpiralPattern className="w-8 h-8 text-sunset-500" />
          </div>
        </div>
      </Section>

      {/* Recognition & Credibility */}
      <Section className="bg-gradient-to-br from-eucalyptus-50 via-sand-50 to-ochre-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4">
            National Recognition
          </h2>
          <p className="text-xl text-earth-700 max-w-3xl mx-auto">
            Our results speak for themselves. Government, researchers, and communities are taking notice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {recognitionItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-earth-900 mb-3">
                {item.title}
              </h3>
              <p className="text-earth-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* External Validation */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardBody className="p-8">
              <p className="text-lg text-earth-700 leading-relaxed mb-4">
                <strong className="text-earth-900">From the evaluation report:</strong> "The program has had a significant positive impact on the broader community by addressing the underlying causes of youth offending and promoting cultural healing and cohesion. By reducing recidivism, the program has contributed to a measurable decline in youth-related offences perpetrated by the young people they are working with."
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Partners & Community */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4">
            Working Together
          </h2>
          <p className="text-xl text-earth-700 max-w-3xl mx-auto">
            We've built a network of 30+ partner organizations - Aboriginal-led businesses, mainstream services, government agencies, and community groups. Cultural brokerage means connecting young people to the right supports while maintaining cultural safety.
          </p>
        </div>

        <div className="bg-earth-50 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-earth-900 mb-4 text-lg">Aboriginal Organizations</h3>
              <ul className="space-y-2 text-earth-700">
                <li>Tangentyere Employment</li>
                <li>Congress (Health Services)</li>
                <li>Lhere Artepe Aboriginal Corporation</li>
                <li>NAAJA (Legal Services)</li>
                <li>Akeyulerre Healing Centre</li>
                <li>NPY Lands</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-earth-900 mb-4 text-lg">Education & Training</h3>
              <ul className="space-y-2 text-earth-700">
                <li>St Joseph's School</li>
                <li>Yipirinya School</li>
                <li>Yirara College</li>
                <li>YORET (Training)</li>
                <li>Sadadeen School</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-earth-900 mb-4 text-lg">Support Services</h3>
              <ul className="space-y-2 text-earth-700">
                <li>Saltbush (Bail Support)</li>
                <li>Territory Families</li>
                <li>NT Youth Justice</li>
                <li>Gap Youth Centre</li>
                <li>Centrelink</li>
                <li>Housing Services</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* The Vision - Where We're Going */}
      <Section className="bg-gradient-to-br from-sand-50 via-ochre-50 to-sunset-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-6 text-center">
            The Future We're Building
          </h2>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-earth-700 leading-relaxed">
              This is just the beginning. Our vision extends beyond individual young people to transforming systems, building infrastructure, and creating generational change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardBody className="p-8">
                <h3 className="text-2xl font-semibold text-earth-900 mb-4">
                  Oonchiumpa Hub
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  A culturally-safe one-stop space bringing together all services young people need. Indoor playground, meeting spaces, cultural activities, case management, and brokerage - all under one roof.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h3 className="text-2xl font-semibold text-earth-900 mb-4">
                  Safe Sleeping Infrastructure
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  Residential facility providing safe, stable housing for young people experiencing homelessness. Every child deserves a bed, consistent meals, and a place to call home.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h3 className="text-2xl font-semibold text-earth-900 mb-4">
                  Economic Development on Country
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  Training programs at Loves Creek Station (Nappa Homestead), tourism development, cattle industry pathways. Building generational wealth on Aboriginal land through traditional owner leadership.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-8">
                <h3 className="text-2xl font-semibold text-earth-900 mb-4">
                  Scaling the Model
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  Sharing our approach nationally. Training other communities in cultural authority-based youth work. Proving that Aboriginal-led solutions work everywhere when properly supported.
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Closing Vision Statement */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <blockquote className="text-xl md:text-2xl text-earth-800 italic leading-relaxed mb-6 text-center">
              "We're not just saving individual kids - we're reclaiming our community. We're bringing back cultural authority, creating employment for Aboriginal people, showing our young ones they have a future worth fighting for. This is about generational change."
            </blockquote>
            <p className="text-center text-earth-600 font-semibold">- Tanya Turner</p>
          </div>
        </div>
      </Section>

      {/* How to Get Involved - Multiple CTAs */}
      <Section className="bg-earth-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-6">
            Be Part of the Solution
          </h2>
          <p className="text-xl text-earth-700 mb-12 max-w-3xl mx-auto">
            Whether you're a funder, partner organization, researcher, or community member - there are many ways to support our work.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-earth-900 mb-3 text-lg">For Funders</h3>
              <p className="text-earth-700 mb-4">
                Support proven, cost-effective, Aboriginal-led solutions. Every dollar invested prevents multiple dollars in detention costs.
              </p>
              <a href="mailto:admin@oonchiumpaconsultancy.com.au" className="text-ochre-600 hover:text-ochre-700 font-semibold">
                Partner With Us →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-earth-900 mb-3 text-lg">For Organizations</h3>
              <p className="text-earth-700 mb-4">
                Join our network of 30+ partners. Collaborate on culturally-safe service delivery and youth engagement.
              </p>
              <a href="mailto:admin@oonchiumpaconsultancy.com.au" className="text-ochre-600 hover:text-ochre-700 font-semibold">
                Collaborate →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-earth-900 mb-3 text-lg">For Researchers</h3>
              <p className="text-earth-700 mb-4">
                Partner with us to establish best practices for Aboriginal-led youth work and cultural authority models.
              </p>
              <a href="mailto:admin@oonchiumpaconsultancy.com.au" className="text-ochre-600 hover:text-ochre-700 font-semibold">
                Research With Us →
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-ochre-500 to-sunset-500 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-display font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-xl mb-8 opacity-95">
              Contact us to learn more about our work, explore partnership opportunities, or support young lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:admin@oonchiumpaconsultancy.com.au"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white bg-transparent hover:bg-white hover:text-ochre-600 transition-all duration-200"
              >
                Email Us
              </a>
              <a
                href="tel:0474702523"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-ochre-600 bg-white hover:bg-sand-50 transition-all duration-200"
              >
                Call: 0474 702 523
              </a>
            </div>
          </div>
        </div>
      </Section>

    </>
  );
};
