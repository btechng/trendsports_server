import Prediction from "../models/Prediction.js";
import Match from "../models/Match.js";

function softmax3(a: number, b: number, c: number) {
  const m = Math.max(a,b,c);
  const ea = Math.exp(a-m), eb = Math.exp(b-m), ec = Math.exp(c-m);
  const s = ea+eb+ec; return { home: ea/s, draw: eb/s, away: ec/s };
}

export async function predictForUpcoming() {
  const matches = await Match.find({ date: { $gte: new Date(Date.now()-3600*1000) } }).limit(200);
  for (const m of matches) {
    const homeForm = (m.homeForm?.reduce((a,b)=>a+b,0) || 0) / Math.max(1, m.homeForm?.length || 1);
    const awayForm = (m.awayForm?.reduce((a,b)=>a+b,0) || 0) / Math.max(1, m.awayForm?.length || 1);
    const homeAdv = 0.2;
    const baseHome = (m.homeOdds ? 1/m.homeOdds : 0.45) + homeForm*0.05 + homeAdv;
    const baseDraw = (m.drawOdds ? 1/m.drawOdds : 0.25) + (Math.abs(homeForm-awayForm)<0.5 ? 0.05:0);
    const baseAway = (m.awayOdds ? 1/m.awayOdds : 0.30) + awayForm*0.05;
    const probs = softmax3(baseHome, baseDraw, baseAway);
    const pick = probs.home>probs.away && probs.home>probs.draw ? "HOME" : (probs.away>probs.draw?"AWAY":"DRAW");
    const explanation = `Home form ${homeForm.toFixed(2)}, away form ${awayForm.toFixed(2)}, baseline odds weighted → leaning ${pick}.`;
    await Prediction.findOneAndUpdate({ match: m._id }, { match: m._id, method: "heuristic", probs, pick, explanation }, { upsert: true });
  }
}
