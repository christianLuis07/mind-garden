"use client";

import { motion } from "framer-motion";
import { AlertCircle, CloudRain, ShieldX, Ghost, Wind, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const problems = [
  {
    title: "Mental Overload",
    description: "A racing mind with too many open tabs, making it difficult to unplug at the end of the day.",
    icon: Ghost,
    color: "text-amber-500",
  },
  {
    title: "Chronic Tension",
    description: "Work deadlines and daily demands that keep your nervous system on constant high alert.",
    icon: CloudRain,
    color: "text-blue-500",
  },
  {
    title: "Nowhere to Unpack",
    description: "Bottling up thoughts because you worry about being judged or misunderstood by those around you.",
    icon: ShieldX,
    color: "text-rose-500",
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 glass dark:bg-black/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/10">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-widest">Why MindGarden</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-foreground">
                Modern life is loud. Your mind deserves a <span className="text-primary italic font-serif">quiet room.</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                When responsibilities pile up, it is easy to disconnect from how you truly feel. MindGarden provides a private sanctuary to slow down, reflect without judgment, and regain emotional balance.
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(64 + i)}
                       </div>
                    ))}
                 </div>
                 <p className="text-sm font-bold text-muted-foreground italic">
                    Joined by hundreds of mindful individuals daily
                 </p>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 grid gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-6 p-8 rounded-[2rem] bg-card border border-border/40 shadow-xl shadow-black/5 hover:shadow-2xl transition-all group"
              >
                <div className={cn("p-4 rounded-2xl bg-muted/50 group-hover:scale-110 transition-transform duration-500", problem.color.replace('text-', 'bg-').concat('/10'))}>
                  <problem.icon className={cn("w-6 h-6", problem.color)} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{problem.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
