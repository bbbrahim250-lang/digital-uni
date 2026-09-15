import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/theme";
import Ticket from "@/src/components/Ticket";
import VideoBox from "@/src/components/VideoBox";
import BoardingPassCard from "@/src/components/BoardingPassCard";
import { Chip, PrimaryButton, GhostButton, PickerRow, Card, SectionTitle } from "@/src/components/UI";
import {
  TRACKS, PROGRAMS, CREDENTIALS, STORE_EXPLORATORY, STORE_EVENTS, FUND_TIERS,
  APPAREL_ITEMS, AIML_QUIZ, AI_LAB_STAGES, FLAGSHIP_APPS, IMAGES, VIDEOS,
  COMMUNITIES, CONNECTIONS, INTERESTS, SIGNATURE_CONSENTS, CAMPAIGN_DISCLAIMER,
} from "@/src/data/appData";
import { downloadSupportLetter, downloadCertificate, downloadCouncilLetterTemplate } from "@/src/utils/pdf";

type ViewKey =
  | "home" | "track" | "enroll" | "ticket" | "certify"
  | "legal" | "reserve" | "store" | "checkout" | "orderConfirmed"
  | "tryout" | "tryoutConfirmation" | "course" | "grading" | "courseFail" | "badge"
  | "aiLab" | "commercialization" | "discover" | "takeAction"
  | "signIn" | "signUp" | "signInConfirmed" | "signUpConfirmed"
  | "community" | "communityConfirmed" | "pledge" | "pledgeConfirmed";

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function App() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<ViewKey>("home");
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [pendingCampus, setPendingCampus] = useState<string | null>(null);
  const [userType, setUserType] = useState<"college" | "highschool">("college");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [financialAid, setFinancialAid] = useState(false);
  const [legalRole, setLegalRole] = useState<"judge" | "lawyer" | "clerk">("judge");
  const [cart, setCart] = useState<Record<string, { name: string; price: number; qty: number }>>({});
  const [payMethod, setPayMethod] = useState<string>("Credit Card");
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [lastTicket, setLastTicket] = useState<any>(null);
  const [lastBadge, setLastBadge] = useState<any>(null);
  const [lastTryout, setLastTryout] = useState<any>(null);
  const [lastSignature, setLastSignature] = useState<any>(null);
  const [lastPledge, setLastPledge] = useState<any>(null);
  const [tryoutSport, setTryoutSport] = useState<string | null>(null);
  const [tryoutTeam, setTryoutTeam] = useState<string | null>(null);
  const [tryoutDocs, setTryoutDocs] = useState<Record<string, boolean>>({});
  const [courseFirstName, setCourseFirstName] = useState("");
  const [courseLastName, setCourseLastName] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [gradingStep, setGradingStep] = useState(0);
  const [signUpRole, setSignUpRole] = useState<string>("Student");
  const [signInRole, setSignInRole] = useState<string>("Guest");

  const track = selectedTrack ? TRACKS.find((t) => t.id === selectedTrack) : null;
  const program = selectedProgram ? PROGRAMS.find((p) => p.id === selectedProgram) : null;
  const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const cartTotal = Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0);

  const goHome = () => { setView("home"); setSelectedTrack(null); setSelectedProgram(null); setPendingCampus(null); };

  const addToCart = (id: string, name: string, price: number) => {
    setCart((c) => ({ ...c, [id]: { name, price, qty: (c[id]?.qty || 0) + 1 } }));
  };
  const removeFromCart = (id: string) => setCart((c) => { const n = { ...c }; delete n[id]; return n; });
  const setQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((c) => ({ ...c, [id]: { ...c[id], qty } }));
  };

  const completeEnrollment = async () => {
    if (!track || !program) return;
    const ticketId = `DU-AIT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const t = {
      ticketId,
      track: track.name,
      program: program.name,
      campus: pendingCampus,
      total: track.stations.reduce((s, st) => s + st.price, 0),
      stations: track.stations.map((s) => s.name).join(" · "),
    };
    setLastTicket(t);
    setView("ticket");
    // best-effort persist
    try {
      await fetch(`${BACKEND}/api/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track_id: track.id, program_id: program.id,
          user_type: userType, financial_aid: financialAid, campus: pendingCampus,
        }),
      });
    } catch {}
  };

  const completeOrder = async () => {
    const items = Object.entries(cart).map(([id, v]) => ({ id, name: v.name, price: v.price, qty: v.qty }));
    const total = cartTotal;
    const refId = `DU-ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setLastOrder({ refId, items, total, method: payMethod, count: cartCount });
    try {
      await fetch(`${BACKEND}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, method: payMethod }),
      });
    } catch {}
    setCart({});
    setView("orderConfirmed");
  };

  const submitQuiz = () => {
    setGradingStep(0);
    setView("grading");
    const steps = [800, 800, 800];
    steps.forEach((delay, i) => {
      setTimeout(() => setGradingStep(i + 1), delay * (i + 1));
    });
    setTimeout(async () => {
      const correct = AIML_QUIZ.reduce((c, q, i) => c + (quizAnswers[i] === q.correct ? 1 : 0), 0);
      const percent = (correct / AIML_QUIZ.length) * 100;
      if (percent >= 80) {
        const badgeId = `DU-BADGE-AIML-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        setLastBadge({ badgeId, learner: `${courseFirstName} ${courseLastName}`.trim() || "A. Learner", score: correct, total: AIML_QUIZ.length, percent });
        try {
          await fetch(`${BACKEND}/api/badges`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              course_id: "aiml", first_name: courseFirstName || "A", last_name: courseLastName || "Learner",
              score: correct, total: AIML_QUIZ.length,
            }),
          });
        } catch {}
        setView("badge");
      } else {
        setLastBadge({ score: correct, total: AIML_QUIZ.length, percent });
        setView("courseFail");
      }
    }, 2400);
  };

  const submitTryout = async () => {
    const docs = Object.values(tryoutDocs).filter(Boolean).length;
    const sportCode = (tryoutSport || "").slice(0, 3).toUpperCase();
    const refId = `DU-TRY-${sportCode}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    setLastTryout({ refId, sport: tryoutSport, team: tryoutTeam, docs });
    try {
      await fetch(`${BACKEND}/api/tryouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport: tryoutSport, team: tryoutTeam, documents: docs }),
      });
    } catch {}
    setView("tryoutConfirmation");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.surface }}
    >
      <Header
        insetsTop={insets.top}
        cartCount={cartCount}
        onLogo={goHome}
        onStore={() => setView("store")}
        onSignIn={() => setView("signIn")}
        onNav={(key) => {
          if (key === "learn") setView("home");
          if (key === "build") setView("aiLab");
          if (key === "schools") setView("discover");
          if (key === "research") setView("discover");
          if (key === "legal") setView("legal");
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        {view === "home" && <HomeView
          onPick={(id: string) => { setSelectedTrack(id); setView("track"); }}
          onCTA={() => setView("takeAction")}
          onDiscover={() => setView("discover")}
          onCourse={() => setView("course")}
          onCommunity={() => setView("community")}
          onCouncilPdf={() => { downloadCouncilLetterTemplate(); }}
        />}
        {view === "track" && track && (
          <TrackView track={track} onBack={() => setView("home")} onEnroll={() => setView("enroll")} />
        )}
        {view === "enroll" && track && (
          <EnrollView
            userType={userType} setUserType={setUserType}
            resumeUploaded={resumeUploaded} setResumeUploaded={setResumeUploaded}
            selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram}
            financialAid={financialAid} setFinancialAid={setFinancialAid}
            trackName={track.name}
            firstTwo={track.stations.slice(0, 2).map((s) => s.name)}
            onBack={() => setView("track")}
            onSubmit={completeEnrollment}
          />
        )}
        {view === "ticket" && lastTicket && (
          <TicketConfirmView t={lastTicket} onDone={goHome} onCertify={() => setView("certify")} />
        )}
        {view === "certify" && <CertifyView onBack={goHome} />}
        {view === "legal" && <LegalView role={legalRole} setRole={setLegalRole} onBack={goHome} />}
        {view === "store" && (
          <StoreView
            cart={cart} addToCart={addToCart}
            onCheckout={() => setView("checkout")}
            onTryout={() => setView("tryout")}
            onBack={goHome}
            onPledge={() => setView("pledge")}
          />
        )}
        {view === "checkout" && (
          <CheckoutView
            cart={cart} setQty={setQty} removeFromCart={removeFromCart}
            payMethod={payMethod} setPayMethod={setPayMethod}
            total={cartTotal}
            onBack={() => setView("store")} onComplete={completeOrder}
          />
        )}
        {view === "orderConfirmed" && lastOrder && (
          <OrderConfirmedView order={lastOrder} onContinue={() => setView("store")} onHome={goHome} />
        )}
        {view === "tryout" && (
          <TryoutView
            sport={tryoutSport} setSport={setTryoutSport}
            team={tryoutTeam} setTeam={setTryoutTeam}
            docs={tryoutDocs} setDocs={setTryoutDocs}
            onBack={() => setView("store")} onSubmit={submitTryout}
          />
        )}
        {view === "tryoutConfirmation" && lastTryout && (
          <TryoutConfirmationView t={lastTryout} onBack={() => setView("store")} />
        )}
        {view === "course" && (
          <CourseView
            firstName={courseFirstName} setFirstName={setCourseFirstName}
            lastName={courseLastName} setLastName={setCourseLastName}
            answers={quizAnswers} setAnswers={setQuizAnswers}
            onBack={goHome} onSubmit={submitQuiz}
          />
        )}
        {view === "grading" && <GradingView step={gradingStep} />}
        {view === "courseFail" && lastBadge && (
          <CourseFailView score={lastBadge.score} onRetry={() => { setQuizAnswers({}); setView("course"); }} onHome={goHome} />
        )}
        {view === "badge" && lastBadge && (
          <BadgeView b={lastBadge} onHome={goHome} onLab={() => setView("aiLab")} />
        )}
        {view === "aiLab" && (
          <AILabView onCommerce={() => setView("commercialization")} onBack={goHome} />
        )}
        {view === "commercialization" && (
          <CommercializationView onDiscover={() => setView("discover")} onBack={() => setView("aiLab")} />
        )}
        {view === "discover" && <DiscoverView onAction={() => setView("takeAction")} onBack={goHome} onTryout={() => setView("tryout")} />}
        {view === "takeAction" && (
          <TakeActionView
            onEnroll={() => setView("home")}
            onLab={() => setView("aiLab")}
            onExplore={() => setView("home")}
            onPartner={() => setView("signUp")}
            onSupport={() => setView("store")}
            onBack={goHome}
          />
        )}
        {view === "signIn" && (
          <SignInView role={signInRole} setRole={setSignInRole} onBack={goHome} onSubmit={() => setView("signInConfirmed")} onSignUp={() => setView("signUp")} onFund={() => setView("store")} />
        )}
        {view === "signUp" && (
          <SignUpView role={signUpRole} setRole={setSignUpRole} onBack={() => setView("signIn")} onSubmit={() => setView("signUpConfirmed")} />
        )}
        {view === "signInConfirmed" && <ConfirmationView title="Welcome Back" subtitle={`Signed in as: ${signInRole}`} onDone={goHome} />}
        {view === "signUpConfirmed" && <ConfirmationView title="Account Created" subtitle={`Registered as: ${signUpRole} · Demo only — no real account was created`} onDone={goHome} />}
        {view === "community" && (
          <CommunityView
            onBack={goHome}
            onDone={(payload: any) => { setLastSignature(payload); setView("communityConfirmed"); }}
          />
        )}
        {view === "communityConfirmed" && lastSignature && (
          <CommunityConfirmedView sig={lastSignature} onHome={goHome} onPledge={() => setView("pledge")} />
        )}
        {view === "pledge" && (
          <PledgeView
            onBack={() => setView("store")}
            onDone={(p: any) => { setLastPledge(p); setView("pledgeConfirmed"); }}
          />
        )}
        {view === "pledgeConfirmed" && lastPledge && (
          <PledgeConfirmedView p={lastPledge} onHome={goHome} />
        )}
      </ScrollView>

      {view === "store" && cartCount > 0 && (
        <Pressable
          testID="cart-bar"
          onPress={() => setView("checkout")}
          style={[styles.cartBar, { paddingBottom: 12 + insets.bottom }]}
        >
          <Text style={styles.cartBarText}>🛒 {cartCount} item(s) · ${cartTotal.toFixed(2)}</Text>
          <Text style={styles.cartBarCTA}>Checkout →</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

// ---------- Header ----------
function Header({ insetsTop, cartCount, onLogo, onStore, onSignIn, onNav }: any) {
  const NAV = [
    { key: "learn", label: "Learn-AI ▾" },
    { key: "build", label: "Build-AI ▾" },
    { key: "schools", label: "AI-Schools ▾" },
    { key: "research", label: "Research ▾" },
  ];
  return (
    <View style={[styles.header, { paddingTop: insetsTop + 8 }]}>
      <View style={styles.headerRow1}>
        <Pressable onPress={onLogo} style={{ flexDirection: "row", alignItems: "center" }} testID="header-logo">
          <View style={styles.logoMark}><Text style={styles.logoMarkTxt}>UNI</Text></View>
          <Text style={styles.wordmark}>DIGITAL-UNI</Text>
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Pressable onPress={onStore} testID="header-store" style={styles.storeBtn}>
            <Text style={styles.storeTxt}>🛒 Store</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}><Text style={styles.cartBadgeTxt}>{cartCount}</Text></View>
            )}
          </Pressable>
          <View style={styles.langPill}><Text style={styles.langTxt}>EN ▾</Text></View>
        </View>
      </View>
      <View style={styles.headerRow2}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tagLine1}>Industrial Revolution 4.0</Text>
          <Text style={styles.tagLine2}>Lead With AI.</Text>
        </View>
        <Pressable onPress={onSignIn} style={styles.signInPill} testID="header-signin">
          <Text style={styles.signInTxt}>Sign In</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }} style={{ marginTop: 8 }}>
        {NAV.map((n) => (
          <Pressable key={n.key} onPress={() => onNav(n.key)} style={styles.navChip} testID={`nav-${n.key}`}>
            <Text style={styles.navChipTxt}>{n.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ---------- Home ----------
function HomeView({ onPick, onCTA, onDiscover, onCourse, onCommunity, onCouncilPdf }: any) {
  return (
    <View>
      <View style={styles.hero}>
        <VideoBox source={VIDEOS.hero} poster={IMAGES.stations} style={StyleSheet.absoluteFillObject} testID="hero-video" />
        <LinearGradient colors={["rgba(10,14,31,0.15)", "rgba(10,14,31,0.9)"]} style={StyleSheet.absoluteFillObject} />
        <View style={{ padding: 20, minHeight: 220, justifyContent: "flex-end" }}>
          <Text style={styles.heroWordmark}>DIGITAL-UNI™ AI TRAIN</Text>
          <Text style={styles.heroTag}>Moving at the speed of learning</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.brandStatement}>DIGITAL-UNI — University of the Future. Jobs of Tomorrow.</Text>
        <Text style={styles.brandLead}>LEAD WITH AI.</Text>
        <PrimaryButton label="Board the AI Train →" onPress={onCTA} testID="cta-board" />
      </View>

      {/* Section 14 — Community Signature & Pledge Campaign entry points */}
      <View style={styles.campaignRow}>
        <Pressable onPress={onCommunity} style={styles.campaignPrimary} testID="home-join-community">
          <Text style={styles.campaignPrimaryLabel}>100,000 · Join Community</Text>
        </Pressable>
        <Pressable onPress={onCouncilPdf} style={styles.campaignSecondary} testID="home-council-letter-pdf">
          <Text style={styles.campaignSecondaryLabel}>City Council Letter · PDF</Text>
        </Pressable>
      </View>

      <View style={styles.stationsBanner}>
        <Image source={IMAGES.stations} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        <LinearGradient colors={["rgba(10,14,31,0.1)", "rgba(10,14,31,0.75)"]} style={StyleSheet.absoluteFillObject} />
        <View style={{ padding: 14 }}>
          <Text style={styles.stationsKicker}>ONE TRAIN · MANY DESTINATIONS</Text>
          <Text style={styles.stationsTitle}>Lycée Paris 8 · New York · Algiers · Kuala Lumpur · Santa Monica-Malibu · Palo Alto-Redwood City</Text>
        </View>
      </View>

      <SectionTitle testID="pick-your-track">Pick Your Track</SectionTitle>
      <Text style={styles.helper}>Choose a learning track to see its stations and enrollment options.</Text>
      <View style={{ marginTop: 12 }}>
        {TRACKS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => onPick(t.id)}
            style={styles.trackCard}
            testID={`track-${t.id}`}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.trackName}>{t.name}</Text>
              <Text style={styles.trackTag}>{t.tag}</Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton tone="gold" label="Discover the Ecosystem" onPress={onDiscover} testID="cta-discover" />
        <PrimaryButton label="Preview a Sample Course →" onPress={onCourse} testID="cta-course" />
      </View>
      <Chip>Illustrative demo experience — no real payments, accounts, or credentials.</Chip>
    </View>
  );
}

// ---------- Track detail ----------
function TrackView({ track, onBack, onEnroll }: any) {
  const total = track.stations.reduce((s: number, st: any) => s + st.price, 0);
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} testID="track-back" />
      <Text style={styles.h1}>{track.name}</Text>
      <Text style={styles.trackTag}>{track.tag}</Text>

      <View style={{ marginTop: 16 }}>
        {track.stations.map((s: any, i: number) => (
          <View key={i} style={styles.stationRow}>
            <View style={styles.stationBullet}>
              <Text style={styles.stationBulletTxt}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stationName}>{s.name}</Text>
              <Text style={styles.stationDesc}>{s.description}</Text>
            </View>
            <Text style={styles.stationPrice}>${s.price.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <Card style={{ marginTop: 20 }}>
        <Text style={styles.totalLabel}>TOTAL VALUE ACROSS EVERY STATION</Text>
        <Text style={styles.totalBig}>${total.toLocaleString()}</Text>
      </Card>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Continue to Enrollment" onPress={onEnroll} testID="continue-enroll" />
      </View>
    </View>
  );
}

// ---------- Enroll ----------
function EnrollView(p: any) {
  return (
    <View>
      <GhostButton label="← Back" onPress={p.onBack} />
      <Text style={styles.h1}>Enroll — {p.trackName}</Text>
      <Chip>Illustrative sample only — not a real assessment.</Chip>

      <Text style={styles.sectionKicker}>A FEW QUESTIONS (sample)</Text>
      <PickerRow label="College Student" selected={p.userType === "college"} onPress={() => p.setUserType("college")} testID="user-college" />
      <PickerRow label="High School Student (Grades 8-12)" selected={p.userType === "highschool"} onPress={() => p.setUserType("highschool")} testID="user-hs" />

      <Text style={styles.sectionKicker}>RÉSUMÉ (optional)</Text>
      <Pressable style={styles.uploadBox} onPress={() => p.setResumeUploaded((r: boolean) => !r)} testID="upload-resume">
        <Text style={styles.uploadTxt}>{p.resumeUploaded ? "✓ Résumé uploaded" : "Tap to upload résumé"}</Text>
      </Pressable>

      {p.resumeUploaded && (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.recLabel}>Your Personalized Learning Pathway (sample)</Text>
          <Text style={styles.recBody}>Recommended first stops for the {p.userType === "highschool" ? "high school (grades 8-12)" : "college-level"} pathway:</Text>
          {p.firstTwo.map((n: string, i: number) => (
            <Text key={i} style={styles.recItem}>• {n}</Text>
          ))}
        </Card>
      )}

      <Text style={styles.sectionKicker}>CHOOSE YOUR PROGRAM</Text>
      {PROGRAMS.map((prog) => (
        <PickerRow key={prog.id} label={prog.name} subtitle={`${prog.subtitle} · ${prog.audience}`} selected={p.selectedProgram === prog.id} onPress={() => p.setSelectedProgram(prog.id)} testID={`program-${prog.id}`} />
      ))}

      <Pressable style={styles.checkRow} onPress={() => p.setFinancialAid((v: boolean) => !v)} testID="financial-aid">
        <View style={[styles.checkbox, p.financialAid && styles.checkboxSel]}>
          {p.financialAid && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={styles.checkTxt}>Apply for Digital-UNI Scholarship / Tuition Assistance — available toward both programs.</Text>
      </Pressable>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Generate My Ticket" onPress={p.onSubmit} disabled={!p.selectedProgram} testID="generate-ticket" />
      </View>
    </View>
  );
}

// ---------- Ticket / Certify ----------
function TicketConfirmView({ t, onDone, onCertify }: any) {
  const rows = [
    { label: "PASSENGER", value: "A. Learner (sample)" },
    { label: "TRACK", value: t.track },
    { label: "PROGRAM", value: t.program },
  ];
  if (t.campus) rows.push({ label: "CAMPUS", value: t.campus });
  rows.push({ label: "STATIONS", value: t.stations });
  return (
    <View>
      <Text style={styles.h1}>Your Boarding Pass</Text>
      <Ticket
        kicker="AI TRAIN"
        title="PASSENGER TICKET"
        refId={t.ticketId}
        rows={rows}
        qrLabel="SCAN TO BOARD"
        totalLabel="TOTAL ROUTE VALUE"
        totalValue={`$${t.total.toLocaleString()}`}
        footer="SCAN · LEARN · TRAVEL — A BETTER TOMORROW"
        showBtcBadge
        btcUsdAmount={t.total}
        testID="passenger-ticket"
      />
      <PrimaryButton label="See Your Credentials" onPress={onCertify} />
      <GhostButton label="Start over" onPress={onDone} />
    </View>
  );
}

function CertifyView({ onBack }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} />
      <Text style={styles.h1}>Digital-UNI Certified</Text>
      <Text style={styles.helper}>Sample credentials — for preview only</Text>
      {CREDENTIALS.map((c) => (
        <Card key={c.id} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 22, marginRight: 10 }}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.credTitle}>{c.title}</Text>
              <Text style={{ color: colors.success, fontSize: 12 }}>Official Certification — Diploma Verified</Text>
            </View>
          </View>
          <Pressable onPress={() => setExpanded((e) => (e === c.id ? null : c.id))} testID={`cred-${c.id}`}>
            <Text style={styles.eProfile}>{expanded === c.id ? "Hide" : "eProfile →"}</Text>
          </Pressable>
          {expanded === c.id && (
            <View style={styles.credDetail}>
              <Text style={styles.credDetLabel}>CREDENTIAL ID</Text>
              <Text style={styles.credDetVal}>{c.id}</Text>
              <Text style={[styles.credDetLabel, { marginTop: 6 }]}>STATUS</Text>
              <Text style={[styles.credDetVal, { color: colors.success }]}>Verified</Text>
            </View>
          )}
        </Card>
      ))}
      <Chip>Tamper-evident, independently verifiable credentials.</Chip>
    </View>
  );
}

// ---------- Legal AI ----------
function LegalView({ role, setRole, onBack }: any) {
  const data: any = {
    judge: {
      title: "Judge A. Rivera", sub: "Example Superior Court — fictional",
      sections: [
        ["Precedent History (sample)", "Frequently cites controlling appellate precedent on discovery disputes; consistently applies a narrow reading of procedural exceptions."],
        ["Ruling Tendencies (sample)", "Grants continuances sparingly; favors written orders; rarely deviates from tentative rulings absent new authority."],
        ["School of Thought (sample)", "Textualist-leaning; procedurally strict; high deference to precedent."],
      ],
      foot: "Educational research tool only, not legal advice.",
    },
    lawyer: {
      title: "Case Evaluation", sub: "Smith v. Acme Corp — fictional example",
      sections: [
        ["Case Type (sample)", "Breach of contract, commercial lease dispute."],
        ["Relevant Precedent (sample)", "Comparable appellate rulings on notice-and-cure clauses in commercial leases."],
        ["Procedural Posture (sample)", "Pre-filing — demand letter sent, response window open."],
      ],
      foot: "Not legal advice, and not a substitute for a licensed attorney.",
    },
    clerk: {
      title: "Court AI Clerk Assistant", sub: "Sample docket intake — fictional example",
      sections: [
        ["Proof of Service", "Received"],
        ["Case Management Statement", "Pending review"],
        ["Exhibit C", "Missing"],
      ],
      foot: "Administrative document organization only — not legal advice.",
    },
  };
  const d = data[role];
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} />
      <Text style={styles.h1}>Legal AI</Text>
      <Chip tone="warning">Illustrative example only — a fictional composite for demo purposes.</Chip>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        {["judge", "lawyer", "clerk"].map((r) => (
          <Pressable key={r} onPress={() => setRole(r)} style={[styles.roleBtn, role === r && styles.roleBtnSel]} testID={`legal-${r}`}>
            <Text style={[styles.roleTxt, role === r && styles.roleTxtSel]}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
      <Card style={{ marginTop: 16 }}>
        <Text style={styles.h2}>{d.title}</Text>
        <Text style={styles.helper}>{d.sub}</Text>
        {d.sections.map((s: any, i: number) => (
          <View key={i} style={{ marginTop: 10 }}>
            <Text style={styles.credDetLabel}>{s[0]}</Text>
            <Text style={{ color: colors.onSurface, fontSize: 13, marginTop: 2 }}>{s[1]}</Text>
          </View>
        ))}
        <Text style={styles.footNote}>{d.foot}</Text>
      </Card>
    </View>
  );
}

// ---------- Store ----------
function StoreView({ cart, addToCart, onCheckout, onTryout, onBack, onPledge }: any) {
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} />
      <Text style={styles.h1}>Store</Text>
      <Chip>Demo checkout — no real payment is processed.</Chip>

      <SectionTitle>Exploratory Tickets</SectionTitle>
      {STORE_EXPLORATORY.map((s) => (
        <Card key={s.id} style={{ marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.credTitle}>{s.name}</Text>
              <Text style={styles.helper}>{s.subtitle}</Text>
              <Text style={styles.price}>${s.price}</Text>
            </View>
            <Pressable onPress={() => addToCart(s.id, s.name, s.price)} style={styles.addPill} testID={`add-${s.id}`}>
              <Text style={styles.addTxt}>+ Add{cart[s.id] ? ` ×${cart[s.id].qty}` : ""}</Text>
            </Pressable>
          </View>
        </Card>
      ))}

      <SectionTitle>Concerts & Program Tickets</SectionTitle>
      {STORE_EVENTS.map((ev) => {
        const prices = ev.tiers.map((t) => t.price);
        const priceLabel = prices.length > 1
          ? `$${Math.min(...prices).toLocaleString()} – $${Math.max(...prices).toLocaleString()}`
          : `$${prices[0].toLocaleString()}`;
        const refId = `DU-${ev.id.toUpperCase()}-2026`;
        return (
          <View key={ev.id} style={{ marginTop: 14 }}>
            <BoardingPassCard
              tag="SCHOOL OF AI"
              title={ev.title}
              subtitle={`${ev.subtitle} · ${ev.where}`}
              priceLabel={priceLabel}
              refId={refId}
              pillLabel="ADMIT ONE"
              panelKicker="EVENT TICKET"
              testID={`event-card-${ev.id}`}
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {ev.tiers.map((t) => {
                const id = `ticket-${ev.id}-${t.key}`;
                const qty = cart[id]?.qty || 0;
                return (
                  <Pressable
                    key={t.key}
                    onPress={() => addToCart(id, `${ev.title} — ${t.label}`, t.price)}
                    style={[styles.tierBtn, qty > 0 && styles.tierBtnSel]}
                    testID={`event-${ev.id}-${t.key}`}
                  >
                    <Text style={[styles.tierLabel, qty > 0 && styles.tierLabelSel]}>{t.label} · ${t.price}{qty > 0 ? ` ×${qty}` : ""}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      <SectionTitle>Fundraising — AI Lab Research</SectionTitle>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <View style={styles.modePill}><Text style={styles.modePillActive}>Donate Now</Text></View>
        <Pressable onPress={onPledge} style={styles.modePillOutline} testID="fund-ailab-pledge">
          <Text style={styles.modePillOutlineLabel}>Pledge Instead →</Text>
        </Pressable>
      </View>
      <BoardingPassCard
        tag="AI LAB RESEARCH"
        title="Support Digital-UNI AI Lab Research"
        subtitle="Fund applied research at the Digital-AI Research Lab — NESU case study, Green Sovereign Corridors."
        priceLabel={`$${FUND_TIERS[0].toLocaleString()} – $${FUND_TIERS[FUND_TIERS.length - 1].toLocaleString()}`}
        refId="DU-FUND-AILAB-2026"
        pillLabel="SUPPORTER"
        panelKicker="DONATION TICKET"
        testID="fund-card-ailab"
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {FUND_TIERS.map((amt) => {
          const id = `fund-ailab-${amt}`;
          const qty = cart[id]?.qty || 0;
          return (
            <Pressable
              key={amt}
              onPress={() => addToCart(id, `$${amt.toLocaleString()} AI Lab Research Fundraising Ticket`, amt)}
              style={[styles.tierBtn, qty > 0 && styles.tierBtnSel]}
              testID={`fund-ailab-${amt}`}
            >
              <Text style={[styles.tierLabel, qty > 0 && styles.tierLabelSel]}>${amt.toLocaleString()}{qty > 0 ? ` ×${qty}` : ""}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle>Fundraising — AI High Schools</SectionTitle>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <View style={styles.modePill}><Text style={styles.modePillActive}>Donate Now</Text></View>
        <Pressable onPress={onPledge} style={styles.modePillOutline} testID="fund-aihs-pledge">
          <Text style={styles.modePillOutlineLabel}>Pledge Instead →</Text>
        </Pressable>
      </View>
      <BoardingPassCard
        tag="AI HIGH SCHOOLS"
        title="Support the AI-Native Private School Network"
        subtitle="Santa Monica-Malibu · Palo Alto-Redwood City · proposed Lycée Paris 8 partnership."
        priceLabel={`$${FUND_TIERS[0].toLocaleString()} – $${FUND_TIERS[FUND_TIERS.length - 1].toLocaleString()}`}
        refId="DU-FUND-AIHS-2026"
        pillLabel="SUPPORTER"
        panelKicker="DONATION TICKET"
        testID="fund-card-aihs"
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {FUND_TIERS.map((amt) => {
          const id = `fund-aihs-${amt}`;
          const qty = cart[id]?.qty || 0;
          return (
            <Pressable
              key={amt}
              onPress={() => addToCart(id, `$${amt.toLocaleString()} AI High School Fundraising Ticket`, amt)}
              style={[styles.tierBtn, qty > 0 && styles.tierBtnSel]}
              testID={`fund-aihs-${amt}`}
            >
              <Text style={[styles.tierLabel, qty > 0 && styles.tierLabelSel]}>${amt.toLocaleString()}{qty > 0 ? ` ×${qty}` : ""}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle>AI Pioneers Sharks Apparel</SectionTitle>
      {APPAREL_ITEMS.map((a) => (
        <Card key={a.key} style={{ marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.credTitle}>Santa Monica-Malibu {a.name}</Text>
              <Text style={styles.price}>${a.price}</Text>
            </View>
            <Pressable onPress={() => addToCart(`app-${a.key}`, a.name, a.price)} style={styles.addPill} testID={`add-app-${a.key}`}>
              <Text style={styles.addTxt}>+ Add{cart[`app-${a.key}`] ? ` ×${cart[`app-${a.key}`].qty}` : ""}</Text>
            </Pressable>
          </View>
        </Card>
      ))}

      <Card style={{ marginTop: 20 }}>
        <Text style={styles.credTitle}>🏆 AI Pioneers Sharks Team Tryouts</Text>
        <Text style={styles.helper}>Apply for football, basketball, or soccer coaching review.</Text>
        <View style={{ marginTop: 10 }}>
          <PrimaryButton tone="gold" label="Open Tryout Application →" onPress={onTryout} testID="tryout-cta" />
        </View>
      </Card>
    </View>
  );
}

// ---------- Checkout ----------
function CheckoutView({ cart, setQty, removeFromCart, payMethod, setPayMethod, total, onBack, onComplete }: any) {
  const entries = Object.entries(cart) as [string, any][];
  return (
    <View>
      <GhostButton label="← Back to Store" onPress={onBack} />
      <Text style={styles.h1}>Checkout</Text>
      {entries.length === 0 && <Text style={styles.helper}>Your cart is empty.</Text>}
      {entries.map(([id, v]) => (
        <Card key={id} style={{ marginTop: 8 }}>
          <Text style={styles.credTitle}>{v.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Pressable onPress={() => setQty(id, v.qty - 1)} style={styles.qtyBtn} testID={`qty-dec-${id}`}><Text style={styles.qtyTxt}>−</Text></Pressable>
              <Text style={{ color: colors.onSurface, fontWeight: "700" }}>{v.qty}</Text>
              <Pressable onPress={() => setQty(id, v.qty + 1)} style={styles.qtyBtn} testID={`qty-inc-${id}`}><Text style={styles.qtyTxt}>+</Text></Pressable>
            </View>
            <Text style={styles.price}>${(v.qty * v.price).toFixed(2)}</Text>
          </View>
          <Pressable onPress={() => removeFromCart(id)} testID={`remove-${id}`}><Text style={styles.removeTxt}>Remove</Text></Pressable>
        </Card>
      ))}

      <Card style={{ marginTop: 16 }}>
        <Row label="Subtotal" value={`$${total.toFixed(2)}`} />
        <Row label="Shipping" value="Free (demo)" />
        <Row label="Estimated Tax" value="Not calculated in demo" />
        <View style={styles.divider} />
        <Row label="TOTAL" value={`$${total.toFixed(2)}`} bold />
      </Card>

      <Text style={styles.sectionKicker}>MAKE PAYMENT (demo)</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {["Credit Card", "Bitcoin", "Digital Wallet", "Scan Barcode"].map((m) => (
          <Pressable key={m} onPress={() => setPayMethod(m)} style={[styles.payBtn, payMethod === m && styles.payBtnSel]} testID={`pay-${m}`}>
            <Text style={[styles.payTxt, payMethod === m && styles.payTxtSel]}>{m}</Text>
          </Pressable>
        ))}
        <View style={[styles.payBtn, styles.payDisabled]}>
          <Text style={styles.payDisabledTxt}>PayPal (coming soon)</Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Complete Purchase" onPress={onComplete} disabled={entries.length === 0} testID="complete-purchase" />
      </View>
      <Chip>Demo only — no real payment is collected or charged.</Chip>
    </View>
  );
}

function Row({ label, value, bold }: any) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
      <Text style={{ color: bold ? colors.onSurface : colors.onSurfaceSecondary, fontWeight: bold ? "700" : "400" }}>{label}</Text>
      <Text style={{ color: colors.onSurface, fontWeight: bold ? "700" : "500" }}>{value}</Text>
    </View>
  );
}

function OrderConfirmedView({ order, onContinue, onHome }: any) {
  return (
    <View>
      <Text style={styles.h1}>Order Confirmed</Text>
      <Ticket
        kicker="STORE RECEIPT"
        title="PURCHASE CONFIRMED"
        refId={order.refId}
        rows={[
          { label: "ITEMS", value: `${order.count} item(s)` },
        ]}
        qrLabel="SCAN FOR RECEIPT"
        totalLabel="TOTAL CHARGED (demo)"
        totalValue={`$${order.total.toFixed(2)}`}
        subLine={`Paid via ${order.method}`}
        footer="THANK YOU FOR RIDING THE AI TRAIN"
        showBtcBadge
        btcUsdAmount={order.total}
        testID="order-receipt"
      />
      <PrimaryButton label="Continue Shopping" onPress={onContinue} />
      <GhostButton label="Back to Home" onPress={onHome} />
    </View>
  );
}

// ---------- Tryout ----------
function TryoutView(p: any) {
  const docs = ["insurance", "consent", "resume", "coach"];
  const docCount = Object.values(p.docs).filter(Boolean).length;
  return (
    <View>
      <GhostButton label="← Back" onPress={p.onBack} />
      <Text style={styles.h1}>Team Tryout Application</Text>
      <Chip>Illustrative demo only — no personal data is collected or stored.</Chip>

      <Text style={styles.sectionKicker}>SPORT</Text>
      {["Basketball", "Football", "Soccer"].map((s) => (
        <PickerRow key={s} label={s} selected={p.sport === s} onPress={() => p.setSport(s)} testID={`sport-${s}`} />
      ))}

      <Text style={styles.sectionKicker}>TEAM</Text>
      {["AI Pioneers Santa Monica-Malibu Sharks", "AI Pioneers Palo Alto-Redwood City Sharks", "AI Pioneers Sharks — Lycée Paris 8"].map((t) => (
        <PickerRow key={t} label={t} selected={p.team === t} onPress={() => p.setTeam(t)} testID={`team-${t.slice(0, 20)}`} />
      ))}

      <Text style={styles.sectionKicker}>REQUIRED DOCUMENTS ({docCount}/4)</Text>
      {docs.map((d) => (
        <Pressable
          key={d}
          onPress={() => p.setDocs((v: any) => ({ ...v, [d]: !v[d] }))}
          style={styles.uploadBox}
          testID={`doc-${d}`}
        >
          <Text style={styles.uploadTxt}>{p.docs[d] ? `✓ ${d} uploaded` : `Upload ${d}`}</Text>
        </Pressable>
      ))}

      <Card style={{ marginTop: 12 }}>
        <Row label="Tryout Processing Fee" value="$45" />
      </Card>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Submit Tryout Application" onPress={p.onSubmit} disabled={!p.sport || !p.team} testID="submit-tryout" />
      </View>
    </View>
  );
}

function TryoutConfirmationView({ t, onBack }: any) {
  return (
    <View>
      <Text style={styles.h1}>Application Received</Text>
      <Ticket
        kicker="TEAM TRYOUT"
        kickerRight="AI PIONEERS SHARKS"
        title="TRYOUT APPLICATION"
        refId={t.refId}
        rows={[
          { label: "SPORT", value: t.sport },
          { label: "TEAM", value: t.team },
          { label: "DOCUMENTS", value: `${t.docs} of 4` },
        ]}
        qrLabel="SCAN AT CHECK-IN"
        totalLabel="PROCESSING FEE (demo)"
        totalValue="$45"
        footer="SEE YOU AT TRYOUTS — GO SHARKS!"
        showBtcBadge
        btcUsdAmount={45}
        testID="tryout-ticket"
      />
      <PrimaryButton label="Back to Store" onPress={onBack} />
    </View>
  );
}

// ---------- Course ----------
function CourseView(p: any) {
  return (
    <View>
      <GhostButton label="← Back" onPress={p.onBack} />
      <Text style={styles.h1}>AI + ML — Course Preview</Text>
      <Text style={styles.helper}>Sample course · preview lesson clip</Text>
      <View style={styles.videoBox}>
        <VideoBox source={VIDEOS.course} poster={IMAGES.stations} style={StyleSheet.absoluteFillObject} testID="course-video" />
      </View>
      <Text style={styles.blurb}>Foundations of AI and ML: what they are, how models learn from data, and where they show up in everyday tools.</Text>

      <Text style={styles.sectionKicker}>YOUR NAME (for the badge)</Text>
      <TextInput value={p.firstName} onChangeText={p.setFirstName} placeholder="First name" placeholderTextColor={colors.muted} style={styles.input} testID="course-first" />
      <TextInput value={p.lastName} onChangeText={p.setLastName} placeholder="Last name" placeholderTextColor={colors.muted} style={styles.input} testID="course-last" />

      <Text style={styles.sectionKicker}>QUICK CHECK (PASS AT 80%)</Text>
      {AIML_QUIZ.map((q, qi) => (
        <View key={qi} style={{ marginTop: 12 }}>
          <Text style={styles.qText}>{qi + 1}. {q.q}</Text>
          {q.opts.map((o, oi) => (
            <PickerRow key={oi} label={o} selected={p.answers[qi] === oi} onPress={() => p.setAnswers((a: any) => ({ ...a, [qi]: oi }))} testID={`q${qi}-o${oi}`} />
          ))}
        </View>
      ))}

      <Chip>Illustrative demo only — quiz is graded locally by a mock AI agent.</Chip>
      <View style={{ marginTop: 12 }}>
        <PrimaryButton label="Submit Quiz & Get AI Review" onPress={p.onSubmit} disabled={Object.keys(p.answers).length < AIML_QUIZ.length} testID="submit-quiz" />
      </View>
    </View>
  );
}

function GradingView({ step }: any) {
  const msgs = ["Analyzing your answers…", "Cross-checking against course material…", "Calculating your final score…"];
  return (
    <View style={{ alignItems: "center", paddingTop: 60 }}>
      <ActivityIndicator size="large" color={colors.brandPrimary} />
      <Text style={[styles.h2, { marginTop: 20 }]}>Digital-UNI AI Agent Grading…</Text>
      <Text style={styles.helper}>{msgs[Math.min(step, 2)]}</Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.pdot, i <= step && styles.pdotActive]} />
        ))}
      </View>
    </View>
  );
}

function CourseFailView({ score, onRetry, onHome }: any) {
  return (
    <View>
      <Text style={styles.h1}>Score Below 80%</Text>
      <View style={styles.failBanner}>
        <Text style={styles.failTxt}>You need 80% or higher to earn the Digital-UNI badge. Score: {score}/5.</Text>
      </View>
      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Retry Quiz" onPress={onRetry} testID="retry-quiz" />
        <GhostButton label="Back to Home" onPress={onHome} />
      </View>
    </View>
  );
}

function BadgeView({ b, onHome, onLab }: any) {
  return (
    <View>
      <Text style={styles.h1}>Badge Earned!</Text>
      <Ticket
        kicker="COURSE BADGE"
        kickerRight="AI-verified completion"
        title="AI + ML — FOUNDATIONS BADGE"
        refId={b.badgeId}
        rows={[
          { label: "LEARNER", value: b.learner },
          { label: "QUIZ SCORE", value: `${b.score} / ${b.total} (${b.percent}%)` },
          { label: "VERIFIED BY", value: "Digital-UNI AI Grading Agent" },
        ]}
        qrLabel="SCAN TO VERIFY"
        totalLabel="STATUS"
        totalValue="CERTIFIED"
        footer="NEXT STOP: YOUR NEXT COURSE"
        testID="badge-ticket"
      />
      <PrimaryButton label="Build an App →" onPress={onLab} testID="badge-to-lab" />
      <GhostButton label="Back to Home" onPress={onHome} />
    </View>
  );
}

// ---------- AI Lab ----------
function AILabView({ onCommerce, onBack }: any) {
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} />
      <Text style={styles.h1}>Digital-UNI AI Lab</Text>
      <Text style={styles.helper}>From learning to building — turn what you know into a real product.</Text>
      <View style={{ marginTop: 16 }}>
        {AI_LAB_STAGES.map((s, i) => (
          <View key={i} style={styles.stageRow}>
            <View style={styles.stageNum}><Text style={styles.stageNumTxt}>{i + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stageTitle}>{s.title}</Text>
              <Text style={styles.helper}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <SectionTitle>Flagship Apps Built in the AI Lab</SectionTitle>
      {FLAGSHIP_APPS.map((a, i) => (
        <Card key={i} style={{ marginTop: 8 }}>
          <Text style={styles.credTitle}>{a.name}</Text>
          <Text style={styles.helper}>{a.desc}</Text>
          <Chip>Built from: {a.from}</Chip>
        </Card>
      ))}

      <View style={{ marginTop: 20 }}>
        <PrimaryButton label="See the Commercialization Model →" onPress={onCommerce} testID="see-commerce" />
      </View>
    </View>
  );
}

function CommercializationView({ onDiscover, onBack }: any) {
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} />
      <Text style={styles.h1}>How Commercialization Works</Text>
      <Text style={styles.helper}>Proposed model — not an automatic ownership claim.</Text>
      <Card style={{ marginTop: 16 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 3, backgroundColor: colors.brandPrimary, padding: 20, borderRadius: 12, alignItems: "center" }}>
            <Text style={{ color: "#04140b", fontSize: 32, fontWeight: "700" }}>75%</Text>
            <Text style={{ color: "#04140b", fontSize: 12, fontWeight: "600" }}>Creator / Team</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.brandTertiary, padding: 20, borderRadius: 12, alignItems: "center" }}>
            <Text style={{ color: "#0a0e1f", fontSize: 24, fontWeight: "700" }}>25%</Text>
            <Text style={{ color: "#0a0e1f", fontSize: 10, fontWeight: "600" }}>Digital-UNI</Text>
          </View>
        </View>
        <Text style={{ color: colors.onSurface, fontSize: 13, marginTop: 16, lineHeight: 20 }}>
          This is a proposed business model for apps built and published through the Digital-UNI AI Lab, subject to a definitive developer/commercialization agreement and applicable platform fees. It is not an automatic ownership claim over anything you build outside the AI Lab, and no revenue is actually being collected or shared in this demo.
        </Text>
      </Card>
      <Text style={styles.footNote}>Digital-UNI&apos;s 25% funds the certification programs, AI infrastructure, and research that made the app possible.</Text>
      <PrimaryButton label="Discover the Full Ecosystem →" onPress={onDiscover} testID="see-discover" />
    </View>
  );
}

// ---------- Discover ----------
function DiscoverView({ onAction, onBack, onTryout }: any) {
  const items = [
    { icon: "🏫", title: "AI High School", desc: "Santa Monica-Malibu · Palo Alto-Redwood City · Lycée Paris 8 (proposed)" },
    { icon: "🦈", title: "AI Pioneers Sharks Athletics", desc: "Compete, not just learn — football, basketball, soccer.", cta: onTryout },
    { icon: "🎬", title: "AI Studios / Streaming", desc: "Original AI-education content and creator programs (coming soon)." },
    { icon: "🔬", title: "Research & Innovation", desc: "Digital-AI Research Lab — Green Sovereign Corridors, NESU case study." },
    { icon: "🌐", title: "Community", desc: "Learners, builders, and educators connecting across every campus." },
  ];
  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} />
      <Text style={styles.h1}>Discover Digital-UNI</Text>
      <Text style={styles.helper}>The whole ecosystem this AI Train connects to.</Text>
      {items.map((it, i) => (
        <Card key={i} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 26, marginRight: 12 }}>{it.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.credTitle}>{it.title}</Text>
              <Text style={styles.helper}>{it.desc}</Text>
            </View>
          </View>
          {it.cta && (
            <View style={{ marginTop: 8 }}>
              <PrimaryButton tone="gold" label="Open Tryout Application →" onPress={it.cta} />
            </View>
          )}
        </Card>
      ))}
      <View style={{ marginTop: 20 }}>
        <PrimaryButton label="Take Action →" onPress={onAction} testID="see-actions" />
      </View>
    </View>
  );
}

function TakeActionView(p: any) {
  const actions = [
    { label: "Enroll for September", fn: p.onEnroll, testID: "action-enroll" },
    { label: "Build an App", fn: p.onLab, testID: "action-lab" },
    { label: "Explore a Certification", fn: p.onExplore, testID: "action-explore" },
    { label: "Partner with Digital-UNI", fn: p.onPartner, testID: "action-partner" },
    { label: "Support an AI High School Initiative", fn: p.onSupport, testID: "action-support" },
  ];
  return (
    <View>
      <GhostButton label="← Back" onPress={p.onBack} />
      <Text style={styles.h1}>Take Action</Text>
      <Text style={styles.helper}>Real next steps — pick one that fits you today.</Text>
      {actions.map((a, i) => (
        <View key={i} style={{ marginTop: 10 }}>
          <PrimaryButton label={a.label} onPress={a.fn} tone={i % 2 === 0 ? "primary" : "gold"} testID={a.testID} />
        </View>
      ))}
    </View>
  );
}

// ---------- Sign In / Up ----------
function SignInView(p: any) {
  const roles = ["Guest", "Student", "Guardian", "Staff", "Donor", "Concert Ticket — Purchase or Refund", "Anonymous Complaint", "Civil Rights Violation", "Suggestion & Improvement"];
  const [tab, setTab] = useState<"in" | "up">("in");
  return (
    <View>
      <GhostButton label="← Back" onPress={p.onBack} />
      <View style={styles.signInHero}>
        <Image source={IMAGES.founder} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      </View>
      <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
        <Pressable onPress={() => setTab("in")} style={[styles.tabBtn, tab === "in" && styles.tabBtnSel]} testID="tab-signin">
          <Text style={[styles.tabTxt, tab === "in" && styles.tabTxtSel]}>Sign In</Text>
        </Pressable>
        <Pressable onPress={p.onSignUp} style={[styles.tabBtn]} testID="tab-create">
          <Text style={styles.tabTxt}>Create Account</Text>
        </Pressable>
      </View>

      <Text style={styles.h1}>Welcome to Digital-UNI</Text>
      <PrimaryButton tone="gold" label="Fundraising & Donations →" onPress={p.onFund} testID="fund-top" />

      <Text style={styles.sectionKicker}>I AM A</Text>
      {roles.map((r) => (
        <PickerRow key={r} label={r} selected={p.role === r} onPress={() => p.setRole(r)} testID={`role-${r.slice(0, 10)}`} />
      ))}
      {p.role === "Guest" && (
        <Chip tone="warning">Guests: use the shared password Digital-UNI-SHARK to continue</Chip>
      )}

      <TextInput placeholder="Name" placeholderTextColor={colors.muted} style={styles.input} testID="signin-name" />
      <TextInput placeholder="Email" placeholderTextColor={colors.muted} style={styles.input} testID="signin-email" keyboardType="email-address" />
      <TextInput placeholder="Phone (optional)" placeholderTextColor={colors.muted} style={styles.input} testID="signin-phone" />
      <TextInput placeholder="Password" placeholderTextColor={colors.muted} style={styles.input} testID="signin-pass" secureTextEntry />
      <PrimaryButton label="Sign In (demo)" onPress={p.onSubmit} testID="signin-submit" />

      <Card style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
        <View style={styles.founderPoster}>
          <Image source={IMAGES.founder} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        </View>
        <View style={{ padding: 12 }}>
          <Text style={styles.credTitle}>Brahim BB — Founder & CEO, Digital-UNI</Text>
          <Text style={styles.helper}>University of the Future — AI for a Better World.</Text>
        </View>
      </Card>

      <View style={{ marginTop: 20 }}>
        <PrimaryButton tone="gold" label="Fundraising & Donations →" onPress={p.onFund} testID="fund-bottom" />
      </View>
    </View>
  );
}

function SignUpView(p: any) {
  const roles = ["Student", "Staff / Educator", "Donor", "Concert / Event Guest", "Request Information", "File a Complaint", "Report an Incident"];
  return (
    <View>
      <GhostButton label="← Back" onPress={p.onBack} />
      <Text style={styles.h1}>Create Your Digital-UNI Account</Text>
      <Chip>Illustrative demo form — no real account is created and no password is stored.</Chip>
      <TextInput placeholder="Full Name" placeholderTextColor={colors.muted} style={styles.input} testID="su-name" />
      <TextInput placeholder="Email" placeholderTextColor={colors.muted} style={styles.input} testID="su-email" keyboardType="email-address" />
      <TextInput placeholder="Password" placeholderTextColor={colors.muted} style={styles.input} testID="su-pass" secureTextEntry />
      <Text style={styles.sectionKicker}>I AM A</Text>
      {roles.map((r) => (
        <PickerRow key={r} label={r} selected={p.role === r} onPress={() => p.setRole(r)} testID={`su-role-${r.slice(0, 10)}`} />
      ))}
      <PrimaryButton label="Create Account (demo)" onPress={p.onSubmit} testID="su-submit" />
    </View>
  );
}

function ConfirmationView({ title, subtitle, onDone }: any) {
  return (
    <View style={{ alignItems: "center", paddingTop: 40 }}>
      <Text style={styles.h1}>{title}</Text>
      <View style={styles.successBanner}>
        <Text style={styles.successTxt}>✓ {subtitle}</Text>
      </View>
      <View style={{ marginTop: 24, width: "100%" }}>
        <PrimaryButton label="Back to Home" onPress={onDone} testID="conf-home" />
      </View>
    </View>
  );
}

// ---------- Styles ----------
// ---------- Community Signature screen (Section 14.2) ----------
function CommunityView({ onBack, onDone }: any) {
  const [community, setCommunity] = useState<string>(COMMUNITIES[0].id);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [connection, setConnection] = useState(CONNECTIONS[0]);
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [comment, setComment] = useState("");
  const [signature, setSignature] = useState("");
  const [consents, setConsents] = useState<boolean[]>([false, false, false, false]);
  const [count, setCount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCommunity = COMMUNITIES.find((c) => c.id === community)!;
  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 3 &&
    zip.trim().length > 0 &&
    signature.trim().length > 0 &&
    consents.every(Boolean) &&
    !submitting;

  // Live counter — refreshes when community changes
  React.useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const r = await fetch(`${BACKEND}/api/signatures/count?community=${encodeURIComponent(community)}`);
        const j = await r.json();
        if (ok) setCount(j.count ?? 0);
      } catch { if (ok) setCount(0); }
    })();
    return () => { ok = false; };
  }, [community]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await fetch(`${BACKEND}/api/signatures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          community, full_name: fullName, email, phone, zip_code: zip,
          connection, interest, comment, signature, consents,
        }),
      });
      const j = await r.json();
      onDone({
        signatureId: j.signature_id,
        fullName, community: selectedCommunity.name,
        connection, interest, comment,
        date: new Date().toLocaleDateString(),
      });
    } catch {
      onDone({
        signatureId: `DU-SIG-${community.toUpperCase()}-LOCAL`,
        fullName, community: selectedCommunity.name,
        connection, interest, comment,
        date: new Date().toLocaleDateString(),
      });
    } finally { setSubmitting(false); }
  };

  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} testID="community-back" />
      <Text style={styles.h1}>Community Signature</Text>
      <Text style={styles.helper}>Add your name to the Digital-UNI 100,000 community campaign.</Text>

      <View style={styles.counterCard}>
        <Text style={styles.counterNumber}>{count === null ? "…" : count.toLocaleString()} of 100,000</Text>
        <Text style={styles.counterLabel}>{selectedCommunity.name}</Text>
      </View>

      <SectionTitle>Choose Your Community</SectionTitle>
      {COMMUNITIES.map((c) => (
        <PickerRow
          key={c.id}
          label={c.name}
          selected={community === c.id}
          onPress={() => setCommunity(c.id)}
          testID={`community-${c.id}`}
        />
      ))}

      <SectionTitle>Your Details</SectionTitle>
      <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.onSurfaceMuted} value={fullName} onChangeText={setFullName} testID="community-name" />
      <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={colors.onSurfaceMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" testID="community-email" />
      <TextInput style={styles.input} placeholder="Phone number (optional)" placeholderTextColor={colors.onSurfaceMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" testID="community-phone" />
      <TextInput style={styles.input} placeholder="ZIP code" placeholderTextColor={colors.onSurfaceMuted} value={zip} onChangeText={setZip} testID="community-zip" />

      <SectionTitle>Your {selectedCommunity.name.split(",")[0]} connection</SectionTitle>
      {CONNECTIONS.map((c) => (
        <PickerRow key={c} label={c} selected={connection === c} onPress={() => setConnection(c)} testID={`community-conn-${c}`} />
      ))}

      <SectionTitle>Primary area of interest</SectionTitle>
      {INTERESTS.map((c) => (
        <PickerRow key={c} label={c} selected={interest === c} onPress={() => setInterest(c)} testID={`community-int-${c}`} />
      ))}

      <SectionTitle>Why do you support this proposal?</SectionTitle>
      <TextInput
        style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
        multiline
        placeholder="Share a brief statement, opinion, or idea for the proposed school and project"
        placeholderTextColor={colors.onSurfaceMuted}
        value={comment}
        onChangeText={setComment}
        testID="community-comment"
      />

      <SectionTitle>Electronic signature</SectionTitle>
      <TextInput
        style={[styles.input, { fontFamily: Platform.OS === "web" ? "cursive" : "System", fontStyle: "italic" }]}
        placeholder="Type your full legal name"
        placeholderTextColor={colors.onSurfaceMuted}
        value={signature}
        onChangeText={setSignature}
        testID="community-signature"
      />
      {signature.length > 0 && fullName.length > 0 && signature.trim() !== fullName.trim() && (
        <Chip>Signature does not match Full name — you can still submit, but please double-check.</Chip>
      )}

      <SectionTitle>Consent</SectionTitle>
      {SIGNATURE_CONSENTS.map((label, i) => {
        const cityWord = selectedCommunity.name.split(",")[0];
        const rendered = label.replace(/\{city\}/g, cityWord);
        return (
          <Pressable
            key={i}
            onPress={() => setConsents((prev) => prev.map((v, j) => (j === i ? !v : v)))}
            style={styles.consentRow}
            testID={`community-consent-${i}`}
          >
            <View style={[styles.checkbox, consents[i] && styles.checkboxSel]}>
              {consents[i] && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkTxt}>{rendered}</Text>
          </Pressable>
        );
      })}

      <View style={styles.notePanel}>
        <Text style={styles.noteText}>{CAMPAIGN_DISCLAIMER}</Text>
      </View>

      <PrimaryButton label={submitting ? "Submitting…" : "Review and download my support letter"} onPress={submit} disabled={!canSubmit} testID="community-submit" />
      <Chip>Illustrative demo — submissions are stored in the app database. No email is dispatched.</Chip>
    </View>
  );
}

function CommunityConfirmedView({ sig, onHome, onPledge }: any) {
  const community = COMMUNITIES.find((c) => sig.community.startsWith(c.name.split(",")[0])) || COMMUNITIES[0];
  return (
    <View>
      <Text style={styles.h1}>Signature Received</Text>
      <Text style={styles.helper}>Your community signature has been recorded.</Text>

      <View style={styles.receiptCard}>
        <View style={[styles.crest, { backgroundColor: community.crestColor }]}>
          <Text style={styles.crestInitials}>{community.crestInitials}</Text>
        </View>
        <Text style={styles.certKicker}>DIGITAL-UNI COMMUNITY REGISTRATION</Text>
        <Text style={styles.certTitle}>Declaration of Support</Text>
        <Text style={styles.certPresented}>presented to</Text>
        <Text style={styles.certName}>{sig.fullName}</Text>
        <Text style={styles.certMeta}>{sig.community} · {sig.connection}</Text>
        <Text style={styles.certId}>{sig.signatureId}</Text>
      </View>

      <PrimaryButton label="Download Support Letter (PDF)" onPress={() => downloadSupportLetter(sig)} testID="community-download-letter" />
      <PrimaryButton tone="gold" label="Continue with a Pledge →" onPress={onPledge} testID="community-to-pledge" />
      <GhostButton label="Back to Home" onPress={onHome} />
    </View>
  );
}

// ---------- Pledge screen (Section 14.3) ----------
function PledgeView({ onBack, onDone }: any) {
  const [community, setCommunity] = useState<string>(COMMUNITIES[0].id);
  const [fund, setFund] = useState<string>("ailab");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<number>(1000);
  const [submitting, setSubmitting] = useState(false);
  const selectedCommunity = COMMUNITIES.find((c) => c.id === community)!;
  const canSubmit = fullName.trim().length > 0 && email.trim().length > 3 && tier > 0 && !submitting;

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await fetch(`${BACKEND}/api/pledges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community, full_name: fullName, email, tier, fund }),
      });
      const j = await r.json();
      onDone({
        certificateId: j.certificate_id,
        fullName, community: selectedCommunity.name,
        tier, fund: fund === "ailab" ? "AI Lab Research" : "AI High Schools",
        date: new Date().toLocaleDateString(),
        crestInitials: selectedCommunity.crestInitials,
        crestColor: selectedCommunity.crestColor,
      });
    } catch {
      onDone({
        certificateId: `DU-CERT-${community.toUpperCase()}-LOCAL`,
        fullName, community: selectedCommunity.name, tier,
        fund: fund === "ailab" ? "AI Lab Research" : "AI High Schools",
        date: new Date().toLocaleDateString(),
        crestInitials: selectedCommunity.crestInitials,
        crestColor: selectedCommunity.crestColor,
      });
    } finally { setSubmitting(false); }
  };

  return (
    <View>
      <GhostButton label="← Back" onPress={onBack} testID="pledge-back" />
      <Text style={styles.h1}>Pledge of Support</Text>
      <Text style={styles.helper}>Commit a pledge amount — no payment is collected at submission. You&apos;ll receive a Community Impact Certificate.</Text>

      <SectionTitle>Fund</SectionTitle>
      <PickerRow label="AI Lab Research" selected={fund === "ailab"} onPress={() => setFund("ailab")} testID="pledge-fund-ailab" />
      <PickerRow label="AI High Schools" selected={fund === "aihs"} onPress={() => setFund("aihs")} testID="pledge-fund-aihs" />

      <SectionTitle>Community</SectionTitle>
      {COMMUNITIES.map((c) => (
        <PickerRow key={c.id} label={c.name} selected={community === c.id} onPress={() => setCommunity(c.id)} testID={`pledge-community-${c.id}`} />
      ))}

      <SectionTitle>Your Name & Email</SectionTitle>
      <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.onSurfaceMuted} value={fullName} onChangeText={setFullName} testID="pledge-name" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.onSurfaceMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" testID="pledge-email" />

      <SectionTitle>Pledge Amount</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[100, 1000, 10000, 100000, 1000000].map((amt) => (
          <Pressable key={amt} onPress={() => setTier(amt)} style={[styles.tierBtn, tier === amt && styles.tierBtnSel]} testID={`pledge-tier-${amt}`}>
            <Text style={[styles.tierLabel, tier === amt && styles.tierLabelSel]}>${amt.toLocaleString()}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteText}>{CAMPAIGN_DISCLAIMER}</Text>
      </View>

      <PrimaryButton label={submitting ? "Submitting…" : "Submit Pledge & Get Certificate"} onPress={submit} disabled={!canSubmit} testID="pledge-submit" />
      <Chip>Pledges are stored in the app database. No payment is processed in this demo.</Chip>
    </View>
  );
}

function PledgeConfirmedView({ p, onHome }: any) {
  return (
    <View>
      <Text style={styles.h1}>Pledge Received</Text>
      <Text style={styles.helper}>Your Community Impact Certificate is ready.</Text>

      <View style={styles.receiptCard}>
        <View style={[styles.crest, { backgroundColor: p.crestColor }]}>
          <Text style={styles.crestInitials}>{p.crestInitials}</Text>
        </View>
        <Text style={styles.certKicker}>COMMUNITY IMPACT CERTIFICATE</Text>
        <Text style={styles.certTitle}>Pledge of Support</Text>
        <Text style={styles.certPresented}>presented to</Text>
        <Text style={styles.certName}>{p.fullName}</Text>
        <Text style={styles.certAmount}>${p.tier.toLocaleString()}</Text>
        <Text style={styles.certMeta}>{p.fund} · {p.community}</Text>
        <Text style={styles.certId}>{p.certificateId}</Text>
      </View>

      <PrimaryButton label="Download Certificate (PDF)" onPress={() => downloadCertificate(p)} testID="pledge-download-cert" />
      <GhostButton label="Back to Home" onPress={onHome} />
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surfaceTertiary,
    paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerRow1: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  headerRow2: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 8 },
  logoMark: {
    width: 30, height: 30, borderRadius: 6, backgroundColor: colors.brandTertiary,
    alignItems: "center", justifyContent: "center",
  },
  logoMarkTxt: { color: "#0a0e1f", fontSize: 10, fontWeight: "700" },
  wordmark: { color: colors.onSurface, fontSize: 15, fontWeight: "700", marginLeft: 8, letterSpacing: 1 },
  storeBtn: {
    backgroundColor: colors.brandSecondary, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, flexDirection: "row", alignItems: "center",
  },
  storeTxt: { color: "#04140b", fontWeight: "700", fontSize: 12 },
  cartBadge: {
    marginLeft: 6, backgroundColor: colors.brandTertiary, width: 18, height: 18,
    borderRadius: 9, alignItems: "center", justifyContent: "center",
  },
  cartBadgeTxt: { color: "#0a0e1f", fontSize: 10, fontWeight: "700" },
  langPill: {
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 8,
    paddingVertical: 6, borderRadius: 999,
  },
  langTxt: { color: colors.onSurfaceSecondary, fontSize: 11 },
  tagLine1: { color: colors.onSurfaceSecondary, fontSize: 11 },
  tagLine2: { color: colors.brandTertiary, fontSize: 14, fontWeight: "700" },
  signInPill: {
    backgroundColor: colors.brandPrimary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
  },
  signInTxt: { color: "#04140b", fontWeight: "700", fontSize: 12 },
  navChip: {
    backgroundColor: colors.surfaceSecondary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: colors.border,
  },
  navChipTxt: { color: colors.onSurface, fontSize: 12, fontWeight: "600" },

  hero: {
    borderRadius: 20, overflow: "hidden", marginTop: 16,
    borderWidth: 1, borderColor: colors.brandSecondary,
  },
  heroWordmark: { color: colors.onSurface, fontSize: 22, fontWeight: "700", letterSpacing: 1 },
  heroTag: { color: colors.brandPrimary, fontSize: 13, marginTop: 4 },

  brandStatement: { color: colors.onSurface, fontSize: 15, fontWeight: "600", lineHeight: 22 },
  brandLead: { color: colors.brandPrimary, fontSize: 28, fontWeight: "700", marginTop: 6, marginBottom: 12, letterSpacing: 1 },

  h1: { color: colors.onSurface, fontSize: 22, fontWeight: "700", marginTop: 16, marginBottom: 6 },
  h2: { color: colors.onSurface, fontSize: 18, fontWeight: "600" },
  helper: { color: colors.onSurfaceSecondary, fontSize: 12 },
  sectionKicker: { color: colors.onSurfaceSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginTop: 20, marginBottom: 8 },
  footNote: { color: colors.onSurfaceTertiary, fontSize: 11, marginTop: 10, marginBottom: 16, fontStyle: "italic" },

  trackCard: {
    backgroundColor: colors.surfaceSecondary, borderRadius: 16, padding: 16,
    marginVertical: 6, flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: colors.border,
  },
  trackName: { color: colors.onSurface, fontSize: 15, fontWeight: "600" },
  trackTag: { color: colors.brandPrimary, fontSize: 11, marginTop: 4 },
  chevron: { color: colors.brandPrimary, fontSize: 20 },

  stationRow: {
    flexDirection: "row", alignItems: "flex-start", marginVertical: 8,
    backgroundColor: colors.surfaceSecondary, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  stationBullet: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brandPrimary,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  stationBulletTxt: { color: "#04140b", fontWeight: "700" },
  stationName: { color: colors.onSurface, fontSize: 14, fontWeight: "600" },
  stationDesc: { color: colors.onSurfaceSecondary, fontSize: 12, marginTop: 2 },
  stationPrice: { color: colors.brandPrimary, fontSize: 13, fontWeight: "700", marginLeft: 8 },

  totalLabel: { color: colors.onSurfaceSecondary, fontSize: 10, letterSpacing: 1.5, fontWeight: "600" },
  totalBig: { color: colors.brandPrimary, fontSize: 26, fontWeight: "700", marginTop: 4 },

  uploadBox: {
    borderWidth: 2, borderColor: colors.border, borderStyle: "dashed",
    borderRadius: 12, padding: 16, alignItems: "center", marginVertical: 6,
  },
  uploadTxt: { color: colors.onSurfaceSecondary, fontSize: 13 },

  recLabel: { color: colors.brandPrimary, fontSize: 12, fontWeight: "700" },
  recBody: { color: colors.onSurfaceSecondary, fontSize: 12, marginTop: 4 },
  recItem: { color: colors.onSurface, fontSize: 13, marginTop: 6 },

  checkRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 16, gap: 10 },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
  },
  checkboxSel: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  checkboxCheck: { color: "#04140b", fontWeight: "700" },
  checkTxt: { color: colors.onSurface, fontSize: 12, flex: 1 },

  credTitle: { color: colors.onSurface, fontSize: 14, fontWeight: "600" },
  eProfile: { color: colors.brandPrimary, fontSize: 12, marginTop: 8, fontWeight: "600" },
  credDetail: { marginTop: 8, padding: 10, backgroundColor: colors.surfaceTertiary, borderRadius: 8 },
  credDetLabel: { color: colors.onSurfaceSecondary, fontSize: 10, letterSpacing: 1, fontWeight: "700" },
  credDetVal: { color: colors.onSurface, fontSize: 12, marginTop: 2 },

  roleBtn: {
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
  },
  roleBtnSel: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  roleTxt: { color: colors.onSurfaceSecondary, fontSize: 12, fontWeight: "600" },
  roleTxtSel: { color: "#04140b" },

  price: { color: colors.brandPrimary, fontSize: 14, fontWeight: "700", marginTop: 4 },
  addPill: {
    backgroundColor: colors.brandPrimary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
  },
  addTxt: { color: "#04140b", fontSize: 12, fontWeight: "700" },

  eventCard: {
    borderRadius: 16, overflow: "hidden", minHeight: 140, borderWidth: 1, borderColor: colors.border,
  },
  eventTag: { color: colors.brandTertiary, fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  eventTitle: { color: colors.onSurface, fontSize: 15, fontWeight: "700", marginTop: 6 },
  eventSub: { color: colors.onSurfaceSecondary, fontSize: 11, marginTop: 2 },

  tierBtn: {
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, backgroundColor: colors.surfaceSecondary,
  },
  tierBtnSel: { borderColor: colors.brandPrimary, backgroundColor: "rgba(52,224,138,0.1)" },
  tierLabel: { color: colors.onSurface, fontSize: 12, fontWeight: "600" },
  tierLabelSel: { color: colors.brandPrimary },

  qtyBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceTertiary,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border,
  },
  qtyTxt: { color: colors.onSurface, fontSize: 16, fontWeight: "700" },
  removeTxt: { color: colors.error, fontSize: 12, marginTop: 8 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 6 },
  payBtn: {
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, backgroundColor: colors.surfaceSecondary,
  },
  payBtnSel: { borderColor: colors.brandPrimary, backgroundColor: "rgba(52,224,138,0.1)" },
  payTxt: { color: colors.onSurface, fontSize: 12, fontWeight: "600" },
  payTxtSel: { color: colors.brandPrimary },
  payDisabled: { borderStyle: "dashed", opacity: 0.5 },
  payDisabledTxt: { color: colors.onSurfaceTertiary, fontSize: 12, fontWeight: "600" },

  cartBar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: colors.brandPrimary, paddingHorizontal: 20, paddingTop: 14,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  cartBarText: { color: "#04140b", fontSize: 14, fontWeight: "700" },
  cartBarCTA: { color: "#04140b", fontSize: 14, fontWeight: "700" },

  videoBox: {
    borderRadius: 12, overflow: "hidden", height: 180, marginTop: 16,
    borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center",
  },
  playCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(52,224,138,0.9)",
    alignItems: "center", justifyContent: "center",
  },
  blurb: { color: colors.onSurfaceSecondary, fontSize: 13, marginTop: 12, lineHeight: 20 },
  input: {
    backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14, color: colors.onSurface, fontSize: 14, marginVertical: 4,
  },
  qText: { color: colors.onSurface, fontSize: 13, fontWeight: "600", marginBottom: 6 },
  pdot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  pdotActive: { backgroundColor: colors.brandPrimary },
  failBanner: {
    backgroundColor: colors.errorBg, borderColor: colors.errorBorder, borderWidth: 1,
    padding: 14, borderRadius: 12, marginTop: 12,
  },
  failTxt: { color: colors.error, fontSize: 13 },
  successBanner: {
    backgroundColor: colors.successBg, borderColor: colors.successBorder, borderWidth: 1,
    padding: 14, borderRadius: 12, marginTop: 12, width: "100%",
  },
  successTxt: { color: colors.successText, fontSize: 13, fontWeight: "600" },

  stageRow: {
    flexDirection: "row", padding: 12, marginVertical: 4, alignItems: "center",
    backgroundColor: colors.surfaceSecondary, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
  },
  stageNum: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.brandSecondary,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  stageNumTxt: { color: "#04140b", fontWeight: "700" },
  stageTitle: { color: colors.onSurface, fontSize: 14, fontWeight: "700" },

  tabBtn: {
    flex: 1, padding: 12, borderRadius: 999, backgroundColor: colors.surfaceSecondary,
    alignItems: "center", borderWidth: 1, borderColor: colors.border,
  },
  tabBtnSel: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  tabTxt: { color: colors.onSurfaceSecondary, fontSize: 12, fontWeight: "600" },
  tabTxtSel: { color: "#04140b" },
  founderAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.brandTertiary,
    alignItems: "center", justifyContent: "center",
  },
  stationsBanner: {
    marginTop: 20, borderRadius: 16, overflow: "hidden", minHeight: 140,
    borderWidth: 1, borderColor: colors.border, justifyContent: "flex-end",
  },
  stationsKicker: { color: colors.brandTertiary, fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  stationsTitle: { color: colors.onSurface, fontSize: 13, fontWeight: "600", marginTop: 4, lineHeight: 18 },
  signInHero: {
    marginTop: 12, borderRadius: 16, overflow: "hidden", height: 200,
    borderWidth: 1, borderColor: colors.border,
  },
  founderPoster: { height: 180, width: "100%" },

  // Section 14 — Community Signature & Pledge Campaign
  campaignRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  campaignPrimary: {
    flex: 1, backgroundColor: colors.brandTertiary, borderRadius: 999,
    paddingVertical: 12, alignItems: "center", justifyContent: "center",
    shadowColor: colors.brandTertiary, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  campaignPrimaryLabel: { color: "#0a0e1f", fontWeight: "800", fontSize: 13, letterSpacing: 0.5 },
  campaignSecondary: {
    flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center",
    borderWidth: 1, borderColor: colors.brandTertiary, backgroundColor: "transparent",
  },
  campaignSecondaryLabel: { color: colors.brandTertiary, fontWeight: "700", fontSize: 12 },
  modePill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.brandPrimary },
  modePillActive: { color: "#04140b", fontWeight: "700", fontSize: 12 },
  modePillOutline: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.brandTertiary },
  modePillOutlineLabel: { color: colors.brandTertiary, fontWeight: "700", fontSize: 12 },
  counterCard: {
    marginTop: 12, padding: 14, borderRadius: 14,
    backgroundColor: "rgba(52,224,138,0.1)", borderWidth: 1, borderColor: "rgba(52,224,138,0.3)",
    alignItems: "center",
  },
  counterNumber: { color: colors.brandPrimary, fontSize: 22, fontWeight: "800", letterSpacing: 1 },
  counterLabel: { color: colors.onSurfaceSecondary, fontSize: 12, marginTop: 2 },
  consentRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 10, gap: 10 },
  notePanel: {
    marginTop: 14, padding: 12, borderRadius: 10,
    backgroundColor: "rgba(31,174,143,0.1)", borderLeftWidth: 3, borderLeftColor: colors.brandSecondary,
  },
  noteText: { color: colors.onSurface, fontSize: 11.5, lineHeight: 16 },
  receiptCard: {
    marginTop: 14, padding: 22, borderRadius: 14, backgroundColor: "#f4f1e8",
    alignItems: "center", borderWidth: 1, borderColor: colors.border,
  },
  crest: {
    width: 66, height: 74, alignItems: "center", justifyContent: "center", marginBottom: 8,
    // Hexagonal shield via clipPath — works on web; a plain rounded square on native (visual only).
    ...(Platform.OS === "web" ? ({ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" } as any) : { borderRadius: 8 }),
  },
  crestInitials: { color: "#10162c", fontWeight: "800", fontSize: 22, letterSpacing: 1.5 },
  certKicker: { color: "#f2a93c", fontSize: 10, fontWeight: "800", letterSpacing: 3, marginTop: 2 },
  certTitle: { color: "#10162c", fontSize: 22, fontWeight: "700", letterSpacing: 1, marginTop: 6 },
  certPresented: { color: "#3b4152", fontStyle: "italic", marginTop: 4 },
  certName: { color: "#10162c", fontSize: 20, fontWeight: "700", marginTop: 6, letterSpacing: 0.5 },
  certAmount: { color: "#1fae8f", fontSize: 22, fontWeight: "800", marginTop: 6 },
  certMeta: { color: "#3b4152", fontSize: 11, letterSpacing: 1, marginTop: 6 },
  certId: { color: "#6f7896", fontSize: 10, fontFamily: Platform.OS === "web" ? "monospace" : "System", marginTop: 10, letterSpacing: 1 },
});
