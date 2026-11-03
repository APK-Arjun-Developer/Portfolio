import { heroFacts } from '../content';
import { Reveal } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import SkillGrid from '../components/SkillGrid';
import Story from '../components/Story';

export default function About() {
  return (
    <>
      <div className="tm-wrap pt-14 md:pt-24">
        {/* ── About Me ── */}
        <section aria-labelledby="about-heading">
          <SectionHeader as="h1" id="about-heading" kicker="About" title="About Me" />

          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="space-y-6 lg:col-span-7">
              <p className="text-[clamp(1.25rem,1vw+1rem,1.625rem)] leading-snug text-tm-ink">
                I'm a Full Stack Developer with experience building production web applications
                using <span className="text-tm-accent-text">React, Node.js, and .NET Core</span>. I
                work across the full stack — from database design to responsive UI.
              </p>
              <p className="max-w-[38rem] text-lg">
                I've shipped multi-role SaaS platforms in healthcare, food delivery, and parking —
                systems where data integrity, real-time updates, and role-based access control
                matter.
              </p>
              <p className="max-w-[38rem] text-lg">
                I graduated with a B.E. in Aeronautical Engineering from Excel Engineering College
                (CGPA 8.0) and transitioned into software through the NxtWave MERN programme in
                2023.
              </p>
            </Reveal>

            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
              <div className="rounded-3xl border border-tm-line bg-tm-surface p-6">
                <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-6">
                  {heroFacts.map(({ value, label }) => (
                    <div key={label} className="flex flex-col-reverse gap-1">
                      <dt className="tm-kicker">{label}</dt>
                      <dd className="text-4xl font-semibold leading-none text-tm-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 border-t border-tm-line pt-4 font-mono text-xs text-tm-faint">
                  Based in Tamil Nadu, India
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Experience and education ── */}
      <div className="mt-20 md:mt-28">
        <Story id="experience-heading" kicker="Experience" title="Experience" />
      </div>

      {/* ── Skills ── */}
      <section className="tm-wrap mt-24 md:mt-32" aria-labelledby="skills-heading">
        <SectionHeader
          id="skills-heading"
          kicker="Capabilities"
          title="Technical Skills"
          intro="Technologies I work with across the full stack."
        />
        <SkillGrid />
      </section>
    </>
  );
}
