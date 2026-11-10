/**
 * Centralized Full-Viewport Construction World & Crane Kinematics Controller
 *
 * - Physically connects Trolley, Hoist Cables, Hook, Rigging Slings and
 *   lifted Structural Payloads using shared world coordinates.
 * - Executes 4 sequential crane operations across scroll progress [0..1]:
 *   1. Hoist, traverse & unlock the TECHMO Expertise Container
 *   2. Lift, carry, align & bolt the Pre-Engineered Steel Portal Frame
 *   3. Lift, carry & lower the Long-Span Roof Truss & Cladding Envelope
 *   4. Lift, carry & install the Modern Steel A-Frame Villa + light up complex
 * - Drives smooth camera zoom/pan and depth parallax layers.
 */

export interface CraneControllerInstance {
  destroy: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function invLerp(start: number, end: number, value: number): number {
  if (end <= start) return 0;
  return clamp((value - start) / (end - start), 0, 1);
}

function smoothstep(start: number, end: number, value: number): number {
  const t = invLerp(start, end, value);
  return t * t * (3 - 2 * t);
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

const SCENE_NAV_MAP: Record<number, string> = {
  1: "discover",
  2: "discover",
  3: "our-expertise",
  4: "how-we-build",
  5: "our-work",
  6: "start-a-project",
};

export function initCraneScrollController(): CraneControllerInstance | null {
  const journeyRoot = document.getElementById("construction-journey");
  const camera = document.getElementById("world-camera");
  const parallaxDistant = document.getElementById("parallax-distant");
  const parallaxForeground = document.getElementById("parallax-foreground");

  const trolley = document.getElementById("world-trolley");
  const cableLeft = document.getElementById("hoist-cable-left");
  const cableRight = document.getElementById("hoist-cable-right");
  const slingLeft = document.getElementById("rigging-sling-left");
  const slingRight = document.getElementById("rigging-sling-right");
  const hook = document.getElementById("world-hook");

  const payloadContainer = document.getElementById("payload-container");
  const doorLeft = document.getElementById("container-door-left");
  const doorRight = document.getElementById("container-door-right");
  const payloadSteelFrame = document.getElementById("payload-steel-frame");
  const payloadRoofTruss = document.getElementById("payload-roof-truss");
  const payloadAframe = document.getElementById("payload-aframe");
  const completedGlow = document.getElementById("completed-building-glow");

  if (
    !journeyRoot ||
    !camera ||
    !trolley ||
    !cableLeft ||
    !cableRight ||
    !slingLeft ||
    !slingRight ||
    !hook ||
    !payloadContainer ||
    !doorLeft ||
    !doorRight ||
    !payloadSteelFrame ||
    !payloadRoofTruss ||
    !payloadAframe ||
    !completedGlow
  ) {
    return null;
  }

  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-target]")
  );
  const storyChapters = Array.from(
    document.querySelectorAll<HTMLElement>("[data-story-scene]")
  );

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  let rafId: number | null = null;
  let currentActiveScene = -1;

  const setRiggingPosition = (
    hookX: number,
    hookY: number,
    slingSpanX: number,
    slingTargetY: number,
    showSlings = true
  ) => {
    const jibY = 124;
    trolley.style.transform = `translate3d(${hookX.toFixed(1)}px, 0px, 0px)`;
    hook.style.transform = `translate3d(${hookX.toFixed(1)}px, ${hookY.toFixed(1)}px, 0px)`;

    cableLeft.setAttribute("x1", (hookX - 12).toFixed(1));
    cableLeft.setAttribute("y1", String(jibY));
    cableLeft.setAttribute("x2", (hookX - 12).toFixed(1));
    cableLeft.setAttribute("y2", (hookY - 8).toFixed(1));

    cableRight.setAttribute("x1", (hookX + 12).toFixed(1));
    cableRight.setAttribute("y1", String(jibY));
    cableRight.setAttribute("x2", (hookX + 12).toFixed(1));
    cableRight.setAttribute("y2", (hookY - 8).toFixed(1));

    if (showSlings) {
      slingLeft.style.opacity = "1";
      slingRight.style.opacity = "1";
      slingLeft.setAttribute("x1", (hookX - 8).toFixed(1));
      slingLeft.setAttribute("y1", (hookY + 10).toFixed(1));
      slingLeft.setAttribute("x2", (hookX - slingSpanX).toFixed(1));
      slingLeft.setAttribute("y2", slingTargetY.toFixed(1));

      slingRight.setAttribute("x1", (hookX + 8).toFixed(1));
      slingRight.setAttribute("y1", (hookY + 10).toFixed(1));
      slingRight.setAttribute("x2", (hookX + slingSpanX).toFixed(1));
      slingRight.setAttribute("y2", slingTargetY.toFixed(1));
    } else {
      slingLeft.style.opacity = "0";
      slingRight.style.opacity = "0";
    }
  };

  const updateActiveNav = (sceneIdx: number) => {
    if (sceneIdx === currentActiveScene) return;
    currentActiveScene = sceneIdx;

    const activeNavId = SCENE_NAV_MAP[sceneIdx] || "discover";
    for (const link of navLinks) {
      const isMatch = link.getAttribute("data-nav-target") === activeNavId;
      link.classList.toggle("is-active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }

    for (const chapter of storyChapters) {
      const cIdx = Number(chapter.getAttribute("data-story-scene"));
      chapter.classList.toggle("is-active-chapter", cIdx === sceneIdx);
    }
  };

  const applyAssembledStaticWorld = () => {
    camera.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
    if (parallaxDistant) parallaxDistant.style.transform = "translate3d(0px, 0px, 0px)";
    if (parallaxForeground) parallaxForeground.style.transform = "translate3d(0px, 0px, 0px)";

    payloadContainer.style.transform = "translate3d(360px, 496px, 0px)";
    payloadContainer.style.opacity = "1";
    doorLeft.style.transform = "scaleX(0.04)";
    doorLeft.style.opacity = "0.15";
    doorRight.style.transform = "scaleX(0.04)";
    doorRight.style.opacity = "0.15";

    payloadSteelFrame.style.transform = "translate3d(760px, 380px, 0px)";
    payloadSteelFrame.style.opacity = "1";

    payloadRoofTruss.style.transform = "translate3d(760px, 312px, 0px)";
    payloadRoofTruss.style.opacity = "1";

    payloadAframe.style.transform = "translate3d(1130px, 390px, 0px)";
    payloadAframe.style.opacity = "1";

    completedGlow.style.opacity = "1";
    setRiggingPosition(520, 210, 60, 250, false);
  };

  const renderFrame = () => {
    rafId = null;

    const rect = journeyRoot.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const totalScrollable = Math.max(rect.height - viewportHeight, 1);
    const scrolled = -rect.top;
    const p = clamp(scrolled / totalScrollable, 0, 1);

    // Determine active story scene (1..6)
    let sceneIdx = 1;
    if (p < 0.14) sceneIdx = 1;
    else if (p < 0.30) sceneIdx = 2;
    else if (p < 0.48) sceneIdx = 3;
    else if (p < 0.74) sceneIdx = 4;
    else if (p < 0.88) sceneIdx = 5;
    else sceneIdx = 6;

    updateActiveNav(sceneIdx);

    if (reducedMotionQuery.matches) {
      applyAssembledStaticWorld();
      return;
    }

    // ===================================================================
    // 1. MEANINGFUL CAMERA TRANSITIONS & PARALLAX DEPTH
    // ===================================================================
    let camX = 0;
    let camY = 0;
    let camScale = 1.02;

    if (p < 0.32) {
      // Focus subtly on left crane & container hoist
      const t = smoothstep(0, 0.32, p);
      camX = lerp(45, 85, t);
      camY = lerp(8, -12, t);
      camScale = lerp(1.02, 1.08, t);
    } else if (p < 0.48) {
      // Focus on open container bay
      const t = smoothstep(0.32, 0.48, p);
      camX = lerp(85, 55, t);
      camY = lerp(-12, -18, t);
      camScale = lerp(1.08, 1.06, t);
    } else if (p < 0.78) {
      // Pan smoothly right as crane constructs the Steel Hall, Roof & A-Frame
      const t = smoothstep(0.48, 0.78, p);
      camX = lerp(55, -65, t);
      camY = lerp(-18, -8, t);
      camScale = lerp(1.06, 1.05, t);
    } else {
      // Pull back to panoramic completed complex vista
      const t = smoothstep(0.78, 0.96, p);
      camX = lerp(-65, 0, t);
      camY = lerp(-8, 0, t);
      camScale = lerp(1.05, 1.0, t);
    }

    camera.style.transform = `translate3d(${camX.toFixed(1)}px, ${camY.toFixed(1)}px, 0px) scale(${camScale.toFixed(3)})`;

    if (parallaxDistant) {
      parallaxDistant.style.transform = `translate3d(${(-camX * 0.28).toFixed(1)}px, ${(p * 18).toFixed(1)}px, 0px)`;
    }
    if (parallaxForeground) {
      parallaxForeground.style.transform = `translate3d(${(camX * 0.22).toFixed(1)}px, 0px, 0px)`;
    }

    // ===================================================================
    // 2. CONNECTED CRANE RIGGING & CONSTRUCTION OPERATIONS
    // ===================================================================

    // --- OPERATION 1 (0.00 -> 0.36): Lift, Traverse & Open Container ---
    let contX = 310;
    let contY = 496;
    if (p < 0.08) {
      contX = 310;
      contY = 496;
    } else if (p < 0.17) {
      // Hoist container upward
      const t = smoothstep(0.08, 0.17, p);
      contX = lerp(310, 325, t);
      contY = lerp(496, 372, t);
    } else if (p < 0.26) {
      // Traverse to showcase deck & set down
      const t = smoothstep(0.17, 0.26, p);
      contX = lerp(325, 360, t);
      contY = lerp(372, 496, t);
    } else {
      contX = 360;
      contY = 496;
    }
    payloadContainer.style.transform = `translate3d(${contX.toFixed(1)}px, ${contY.toFixed(1)}px, 0px)`;
    payloadContainer.style.opacity = "1";

    // Container doors swing open between p = 0.25 and p = 0.36
    const doorOpenT = smoothstep(0.25, 0.36, p);
    const doorScale = lerp(1, 0.04, doorOpenT);
    const doorOpacity = lerp(1, 0.15, smoothstep(0.31, 0.37, p));
    doorLeft.style.transform = `scaleX(${doorScale.toFixed(3)})`;
    doorLeft.style.opacity = doorOpacity.toFixed(2);
    doorRight.style.transform = `scaleX(${doorScale.toFixed(3)})`;
    doorRight.style.opacity = doorOpacity.toFixed(2);

    // --- OPERATION 2 (0.36 -> 0.55): Lift, Carry & Install Steel Portal Frame ---
    if (p < 0.36) {
      payloadSteelFrame.style.opacity = "0";
      payloadSteelFrame.style.transform = "translate3d(560px, 240px, 0px)";
    } else if (p < 0.55) {
      const fadeIn = smoothstep(0.36, 0.40, p);
      const carryT = smoothstep(0.38, 0.47, p);
      const lowerT = smoothstep(0.47, 0.55, p);
      const frameX = lerp(560, 760, carryT);
      const frameY = lerp(240, 380, lowerT);
      payloadSteelFrame.style.opacity = fadeIn.toFixed(2);
      payloadSteelFrame.style.transform = `translate3d(${frameX.toFixed(1)}px, ${frameY.toFixed(1)}px, 0px)`;
    } else {
      // Installed on foundation pad at (760, 380)
      payloadSteelFrame.style.opacity = "1";
      payloadSteelFrame.style.transform = "translate3d(760px, 380px, 0px)";
    }

    // --- OPERATION 3 (0.55 -> 0.72): Lift, Carry & Install Roof Truss ---
    if (p < 0.55) {
      payloadRoofTruss.style.opacity = "0";
      payloadRoofTruss.style.transform = "translate3d(580px, 195px, 0px)";
    } else if (p < 0.72) {
      const fadeIn = smoothstep(0.55, 0.59, p);
      const carryT = smoothstep(0.57, 0.65, p);
      const lowerT = smoothstep(0.65, 0.72, p);
      const roofX = lerp(580, 760, carryT);
      const roofY = lerp(195, 312, lowerT);
      payloadRoofTruss.style.opacity = fadeIn.toFixed(2);
      payloadRoofTruss.style.transform = `translate3d(${roofX.toFixed(1)}px, ${roofY.toFixed(1)}px, 0px)`;
    } else {
      // Installed atop Steel Portal Frame at (760, 312)
      payloadRoofTruss.style.opacity = "1";
      payloadRoofTruss.style.transform = "translate3d(760px, 312px, 0px)";
    }

    // --- OPERATION 4 (0.72 -> 0.88): Lift, Carry & Install Modern A-Frame ---
    if (p < 0.72) {
      payloadAframe.style.opacity = "0";
      payloadAframe.style.transform = "translate3d(880px, 250px, 0px)";
    } else if (p < 0.88) {
      const fadeIn = smoothstep(0.72, 0.76, p);
      const carryT = smoothstep(0.74, 0.82, p);
      const lowerT = smoothstep(0.82, 0.88, p);
      const aframeX = lerp(880, 1130, carryT);
      const aframeY = lerp(250, 390, lowerT);
      payloadAframe.style.opacity = fadeIn.toFixed(2);
      payloadAframe.style.transform = `translate3d(${aframeX.toFixed(1)}px, ${aframeY.toFixed(1)}px, 0px)`;
    } else {
      // Installed on right scenic deck at (1130, 390)
      payloadAframe.style.opacity = "1";
      payloadAframe.style.transform = "translate3d(1130px, 390px, 0px)";
    }

    // --- COMPLETED BUILDING LIGHTING & GLAZING (0.86 -> 0.94) ---
    const glowT = smoothstep(0.86, 0.94, p);
    completedGlow.style.opacity = glowT.toFixed(2);

    // ===================================================================
    // 3. MASTER HOOK, CABLE & SLING KINEMATICS (Always Connected!)
    // ===================================================================
    if (p < 0.08) {
      // Hook lowers onto container
      const t = smoothstep(0, 0.08, p);
      const hY = lerp(340, 444, t);
      setRiggingPosition(310, hY, 102, 496, true);
    } else if (p < 0.26) {
      // Hook carries container
      setRiggingPosition(contX, contY - 52, 102, contY, true);
    } else if (p < 0.36) {
      // Container placed; hook uncouples and rises
      const t = smoothstep(0.26, 0.36, p);
      const hX = lerp(360, 560, t);
      const hY = lerp(444, 190, t);
      setRiggingPosition(hX, hY, 90, hY + 42, false);
    } else if (p < 0.55) {
      // Hook carries & lowers Steel Portal Frame
      const carryT = smoothstep(0.38, 0.47, p);
      const lowerT = smoothstep(0.47, 0.55, p);
      const frameX = lerp(560, 760, carryT);
      const frameY = lerp(240, 380, lowerT);
      setRiggingPosition(frameX, frameY - 52, 125, frameY + 42, true);
    } else if (p < 0.72) {
      // Hook carries & lowers Long-Span Roof Truss
      const carryT = smoothstep(0.57, 0.65, p);
      const lowerT = smoothstep(0.65, 0.72, p);
      const roofX = lerp(580, 760, carryT);
      const roofY = lerp(195, 312, lowerT);
      setRiggingPosition(roofX, roofY - 48, 115, roofY + 38, true);
    } else if (p < 0.88) {
      // Hook carries & lowers Modern A-Frame Villa
      const carryT = smoothstep(0.74, 0.82, p);
      const lowerT = smoothstep(0.82, 0.88, p);
      const aframeX = lerp(880, 1130, carryT);
      const aframeY = lerp(250, 390, lowerT);
      setRiggingPosition(aframeX, aframeY - 50, 54, aframeY + 132, true);
    } else {
      // Construction complete — Hook reels up cleanly into salute position
      const t = smoothstep(0.88, 0.96, p);
      const hX = lerp(1130, 520, t);
      const hY = lerp(340, 200, t);
      setRiggingPosition(hX, hY, 50, hY + 40, false);
    }
  };

  const requestUpdate = () => {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(renderFrame);
    }
  };

  const onScroll = () => requestUpdate();
  const onResize = () => requestUpdate();
  const onMediaChange = () => requestUpdate();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  reducedMotionQuery.addEventListener("change", onMediaChange);

  requestUpdate();

  return {
    destroy() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedMotionQuery.removeEventListener("change", onMediaChange);
    },
  };
}
