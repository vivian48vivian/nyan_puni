const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameCard = document.querySelector(".game-card");
const titleScreen = document.getElementById("titleScreen");
const titleCanvas = document.getElementById("titleCanvas");
const titleCtx = titleCanvas.getContext("2d");

const timeText = document.getElementById("timeText");
const stageText = document.getElementById("stageText");
const scoreText = document.getElementById("scoreText");
const pauseButton = document.getElementById("pauseButton");
const missionText = document.getElementById("missionText");
const missionFill = document.getElementById("missionFill");
const missionNotice = document.getElementById("missionNotice");
const stageGoalCard = document.getElementById("stageGoalCard");
const themeText = document.getElementById("themeText");
const targetText = document.getElementById("targetText");
const targetPercentText = document.getElementById("targetPercentText");
const stageProgressFill = document.getElementById("stageProgressFill");
const feverCard = document.getElementById("feverCard");
const feverText = document.getElementById("feverText");
const feverFill = document.getElementById("feverFill");
const skillButton = document.querySelector(".skill-button");
const skillNameText = document.getElementById("skillNameText");
const skillLevelText = document.getElementById("skillLevelText");
const skillFill = document.getElementById("skillFill");
const overlay = document.getElementById("overlay");
const resultPanel = document.getElementById("resultPanel");
const rewardPanel = document.getElementById("rewardPanel");
const rewardSubtitle = document.getElementById("rewardSubtitle");
const rewardOptions = document.getElementById("rewardOptions");
const skillSelectPanel = document.getElementById("skillSelectPanel");
const skillOptions = document.getElementById("skillOptions");
const pausePanel = document.getElementById("pausePanel");
const confirmExitPanel = document.getElementById("confirmExitPanel");
const overlayTitle = document.getElementById("overlayTitle");
const recordText = document.getElementById("recordText");
const finalStageText = document.getElementById("finalStageText");
const finalScoreText = document.getElementById("finalScoreText");
const bestScoreText = document.getElementById("bestScoreText");
const bestStageText = document.getElementById("bestStageText");
const retryButton = document.getElementById("retryButton");
const resumeButton = document.getElementById("resumeButton");
const titleExitButton = document.getElementById("titleExitButton");
const confirmExitYesButton = document.getElementById("confirmExitYesButton");
const confirmExitNoButton = document.getElementById("confirmExitNoButton");
const playButton = document.getElementById("playButton");
const settingsButton = document.getElementById("settingsButton");
const howToButton = document.getElementById("howToButton");
const titleBestScore = document.getElementById("titleBestScore");
const titleBestStage = document.getElementById("titleBestStage");
const versionText = document.getElementById("versionText");
const titleModal = document.getElementById("titleModal");
const titleModalTitle = document.getElementById("titleModalTitle");
const titleModalBody = document.getElementById("titleModalBody");
const titleModalClose = document.getElementById("titleModalClose");

const COLORS = [
  { fill: "#ffadc5", shade: "#f58cab", eye: "#20243a" },
  { fill: "#a7e6d8", shade: "#79d6c4", eye: "#20243a" },
  { fill: "#ffd986", shade: "#f7bf58", eye: "#20243a" },
  { fill: "#b9c9ff", shade: "#91a6f4", eye: "#20243a" },
  { fill: "#d8b9ff", shade: "#bd94ed", eye: "#20243a" }
];

const AUDIO_ASSETS = {
  bgm: {
    title: "assets/bgm/title.mp3",
    stage01: "assets/bgm/stage01.mp3",
    stage02: "assets/bgm/stage02.mp3",
    stage03: "assets/bgm/stage03.mp3",
    stage04: "assets/bgm/stage04.mp3",
    stage05: "assets/bgm/stage05.mp3",
    stage06: "assets/bgm/stage06.mp3",
    stage07: "assets/bgm/stage07.mp3",
    stage08: "assets/bgm/stage08.mp3",
    stage09: "assets/bgm/stage09.mp3",
    stage10: "assets/bgm/stage10.mp3",
    fever: "assets/bgm/fever.mp3",
    timeup: "assets/bgm/timeup.mp3",
    stageclear: "assets/bgm/stageclear.mp3",
    gameover: "assets/bgm/gameover.mp3"
  },
  se: {
    chainStart: "assets/se/chain_start.mp3",
    chainStep: "assets/se/chain_step.mp3",
    pop: "assets/se/pop.mp3",
    longChain: "assets/se/long_chain.mp3",
    goldenSpawn: "assets/se/golden_spawn.mp3",
    goldenGet: "assets/se/golden_get.mp3",
    rainbowSpawn: "assets/se/rainbow_spawn.mp3",
    spikeHit: "assets/se/spike_hit.mp3",
    feverStart: "assets/se/fever_start.mp3",
    feverEnd: "assets/se/fever_end.mp3",
    skillReady: "assets/se/skill_ready.mp3",
    countdown: "assets/se/countdown.mp3"
  },
  ui: {
    gameStart: "assets/ui/game_start.mp3",
    stageStart: "assets/ui/stage_start.mp3",
    stageClear: "assets/ui/stage_clear.mp3",
    stageUp: "assets/ui/stage_up.mp3",
    gameOver: "assets/ui/game_over.mp3",
    allClear: "assets/ui/all_clear.mp3",
    newRecord: "assets/ui/new_record.mp3",
    achievement: "assets/ui/achievement.mp3"
  },
  voice: {}
};

class AudioManager {
  constructor(assets) {
    this.assets = assets;
    this.context = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.seGain = null;
    this.currentBgm = null;
    this.feverLayer = null;
    this.bgmElements = new Map();
    this.bgmFadeTimer = null;
    this.bgmVolume = 0.34;
    this.bgmDuckVolume = 1;
    this.seVolume = 0.75;
    this.muted = false;
    this.silenceRestoreTimer = null;
    this.bgmDuckTimer = null;
    this.bgmTransitionId = 0;
    this.lastStage = 1;
    this.stageFrequencies = [130.81, 146.83, 164.81, 174.61, 196, 220, 246.94, 261.63, 293.66, 329.63];
    this.chainScale = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25];
  }

  ensure() {
    if (this.context) return this.context;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.bgmGain = this.context.createGain();
    this.seGain = this.context.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 1;
    this.bgmGain.gain.value = this.bgmVolume;
    this.seGain.gain.value = this.seVolume;
    this.bgmGain.connect(this.masterGain);
    this.seGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    return this.context;
  }

  unlock() {
    const context = this.ensure();
    if (context && context.state === "suspended") {
      context.resume();
    }
  }

  setBgmVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGain) this.bgmGain.gain.setTargetAtTime(this.bgmVolume, this.context.currentTime, 0.05);
    if (this.currentBgm) {
      this.fadeBgmVolume(this.currentBgm.element, this.getBgmOutputVolume(this.currentBgm.volumeScale), 0.05);
    }
  }

  setSeVolume(volume) {
    this.seVolume = Math.max(0, Math.min(1, volume));
    if (this.seGain) this.seGain.gain.setTargetAtTime(this.seVolume, this.context.currentTime, 0.03);
  }

  setMuted(muted) {
    this.muted = muted;
    const context = this.ensure();
    if (!context) return;
    this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, context.currentTime, 0.04);
    if (this.currentBgm) {
      this.fadeBgmVolume(this.currentBgm.element, this.getBgmOutputVolume(this.currentBgm.volumeScale), 0.04);
    }
  }

  getBgmElement(key) {
    const sourcePath = this.assets.bgm[key];
    if (!sourcePath) return null;
    if (!this.bgmElements.has(key)) {
      const element = new Audio(sourcePath);
      element.preload = "auto";
      element.volume = 0;
      this.bgmElements.set(key, element);
    }
    return this.bgmElements.get(key);
  }

  getBgmOutputVolume(scale = 1) {
    return this.muted ? 0 : this.bgmVolume * this.bgmDuckVolume * scale;
  }

  setElementVolume(element, volume) {
    if (!element) return;
    element.volume = Math.max(0, Math.min(1, volume));
  }

  playBgm(key, { loop = true, fadeSeconds = 0.8, restart = false, volumeScale = 1, onEnded = null } = {}) {
    const context = this.ensure();
    if (!context) return;
    const element = this.getBgmElement(key);
    if (!element) return;

    const current = this.currentBgm;
    if (current && current.key === key && current.loop === loop && !restart) {
      current.onEnded = onEnded;
      current.volumeScale = volumeScale;
      element.loop = loop;
      this.fadeBgmVolume(element, this.getBgmOutputVolume(volumeScale), fadeSeconds);
      if (element.paused) element.play().catch(() => {});
      return;
    }

    this.fadeOutBgm(fadeSeconds * 0.55, false);
    this.bgmTransitionId += 1;
    const transitionId = this.bgmTransitionId;

    element.loop = loop;
    element.onended = null;
    if (restart) {
      try {
        element.currentTime = 0;
      } catch (error) {
        // Some browsers can reject currentTime changes until metadata is ready.
      }
    }
    this.setElementVolume(element, 0);
    element.play().catch(() => {});
    this.currentBgm = { key, element, loop, onEnded, volumeScale };
    this.fadeBgmVolume(element, this.getBgmOutputVolume(volumeScale), fadeSeconds);

    if (!loop && onEnded) {
      element.onended = () => {
        if (this.bgmTransitionId !== transitionId) return;
        this.currentBgm = null;
        onEnded();
      };
    }
  }

  fadeBgmVolume(element, targetVolume, fadeSeconds = 0.5) {
    window.clearInterval(element?._bgmFadeTimer);
    if (!element || fadeSeconds <= 0) {
      this.setElementVolume(element, targetVolume);
      return;
    }

    const startVolume = element.volume;
    const startedAt = performance.now();
    const durationMs = fadeSeconds * 1000;
    element._bgmFadeTimer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / durationMs);
      this.setElementVolume(element, startVolume + (targetVolume - startVolume) * progress);
      if (progress >= 1) {
        window.clearInterval(element._bgmFadeTimer);
        element._bgmFadeTimer = null;
      }
    }, 30);
  }

  playStageBgm(stage, fadeSeconds = 0.8) {
    this.lastStage = Math.max(1, stage);
    const stageNumber = Math.min(10, Math.max(1, Math.floor(stage)));
    const key = `stage${String(stageNumber).padStart(2, "0")}`;
    this.playBgm(key, { loop: true, fadeSeconds });
  }

  playTitleBgm(fadeSeconds = 0.8) {
    this.playBgm("title", { loop: true, fadeSeconds, volumeScale: 0.86 });
  }

  playFeverBgm(fadeSeconds = 0.45) {
    this.playBgm("fever", { loop: true, fadeSeconds });
  }

  playTimeupBgm(fadeSeconds = 0.35) {
    this.playBgm("timeup", { loop: true, fadeSeconds });
  }

  resumeStageBgm(fadeSeconds = 0.6) {
    this.playStageBgm(this.lastStage, fadeSeconds);
  }

  playStageClear(fadeSeconds = 0.35) {
    this.playBgm("stageclear", {
      loop: false,
      fadeSeconds,
      restart: true,
      onEnded: () => this.playTitleBgm(0.7)
    });
  }

  playGameOver(fadeSeconds = 0.35) {
    this.playBgm("gameover", {
      loop: false,
      fadeSeconds,
      restart: true,
      onEnded: () => this.playTitleBgm(0.7)
    });
  }

  stopBgm(fadeSeconds = 0.5) {
    this.fadeOutBgm(fadeSeconds, true);
  }

  fadeOutBgm(fadeSeconds = 0.5, clearCurrent = true) {
    if (!this.currentBgm) return;
    this.bgmTransitionId += 1;
    const record = this.currentBgm;
    record.element.onended = null;
    this.fadeBgmVolume(record.element, 0, fadeSeconds);
    window.setTimeout(() => {
      record.element.pause();
      try {
        record.element.currentTime = 0;
      } catch (error) {
        // Resetting is best-effort; playback can still continue from the start next time.
      }
    }, fadeSeconds * 1000 + 60);
    if (clearCurrent) this.currentBgm = null;
  }

  startFeverLayer() {
    this.playFeverBgm();
  }

  stopFeverLayer(fadeSeconds = 0.6) {
    this.resumeStageBgm(fadeSeconds);
  }

  fadeAndStop(nodes, gain, fadeSeconds) {
    const now = this.context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + fadeSeconds);
    for (const node of nodes) {
      try {
        node.stop(now + fadeSeconds + 0.05);
      } catch (error) {
        // A node can only be stopped once; ignore duplicate stop attempts.
      }
    }
  }

  duckBgm(duration = 1.1) {
    const context = this.ensure();
    if (!context) return;
    window.clearTimeout(this.bgmDuckTimer);
    this.bgmDuckVolume = 0.48;
    if (this.bgmGain) {
      const now = context.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setTargetAtTime(this.bgmVolume * this.bgmDuckVolume, now, 0.035);
    }
    if (this.currentBgm) {
      this.fadeBgmVolume(this.currentBgm.element, this.getBgmOutputVolume(this.currentBgm.volumeScale), 0.08);
    }
    this.bgmDuckTimer = window.setTimeout(() => {
      this.bgmDuckVolume = 1;
      if (this.context && this.bgmGain) {
        this.bgmGain.gain.setTargetAtTime(this.bgmVolume, this.context.currentTime, 0.12);
      }
      if (this.currentBgm) {
        this.fadeBgmVolume(this.currentBgm.element, this.getBgmOutputVolume(this.currentBgm.volumeScale), 0.12);
      }
    }, duration * 1000);
  }

  pauseGameAudio() {
    const context = this.ensure();
    if (!context) return;
    window.clearTimeout(this.bgmDuckTimer);
    this.bgmDuckVolume = 1;
    this.playTitleBgm(0.45);
  }

  resumeGameAudio() {
    const context = this.ensure();
    if (!context) return;
    window.clearTimeout(this.bgmDuckTimer);
    this.bgmDuckVolume = 1;
    this.resumeStageBgm(0.45);
  }

  returnToTitleAudio() {
    this.bgmDuckVolume = 1;
    this.playTitleBgm(0.55);
  }

  silenceBriefly(duration = 0.2) {
    const context = this.ensure();
    if (!context || !this.masterGain) return;
    window.clearTimeout(this.silenceRestoreTimer);
    const now = context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0.0001, now, 0.015);
    this.silenceRestoreTimer = window.setTimeout(() => {
      if (!this.context || !this.masterGain) return;
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1, this.context.currentTime, 0.025);
    }, duration * 1000);
  }

  playTone({ frequency = 440, duration = 0.16, type = "sine", volume = 0.25, attack = 0.01, decay = 0.12, delay = 0, destination = this.seGain } = {}) {
    const context = this.ensure();
    if (!context || !destination) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(attack + 0.02, duration + decay));
    oscillator.start(now);
    oscillator.stop(now + duration + decay + 0.04);
  }

  playSe(name, options = {}) {
    const presets = {
      chainStart: { frequency: 220, duration: 0.1, type: "sine", volume: 0.24 },
      pop: { frequency: 520, duration: 0.08, type: "triangle", volume: 0.28 },
      longChain: { frequency: 880, duration: 0.18, type: "sine", volume: 0.22 },
      goldenSpawn: { frequency: 740, duration: 0.2, type: "triangle", volume: 0.28 },
      goldenGet: { frequency: 990, duration: 0.24, type: "triangle", volume: 0.35 },
      rainbowSpawn: { frequency: 660, duration: 0.32, type: "sine", volume: 0.22 },
      spikeHit: { frequency: 95, duration: 0.18, type: "sawtooth", volume: 0.38 },
      feverStart: { frequency: 660, duration: 0.3, type: "sawtooth", volume: 0.34 },
      feverEnd: { frequency: 330, duration: 0.28, type: "triangle", volume: 0.22 },
      skillReady: { frequency: 1046.5, duration: 0.18, type: "sine", volume: 0.28 },
      countdown: { frequency: 784, duration: 0.12, type: "square", volume: 0.28 },
      countdownEnd: { frequency: 130.81, duration: 0.35, type: "sawtooth", volume: 0.32 }
    };
    const preset = { ...(presets[name] || presets.pop), ...options };
    this.playTone(preset);
  }

  playChainStart() {
    this.playSe("chainStart");
  }

  playChainStep(step) {
    const index = Math.max(0, step - 1);
    const octave = Math.floor(index / this.chainScale.length);
    const frequency = this.chainScale[index % this.chainScale.length] * Math.pow(2, Math.min(1, octave));
    this.playTone({
      frequency,
      duration: 0.09,
      type: "sine",
      volume: Math.min(0.36, 0.18 + index * 0.012),
      attack: 0.006,
      decay: 0.08
    });
  }

  playChainPop(count) {
    this.playSe("pop", { frequency: 430 + Math.min(count, 12) * 26, volume: 0.24 + Math.min(count, 10) * 0.012 });
    if (count >= 10) {
      this.playSe("longChain");
      this.playTone({ frequency: 1174.66, duration: 0.12, type: "sine", volume: 0.16, delay: 0.08 });
      this.playTone({ frequency: 1567.98, duration: 0.14, type: "sine", volume: 0.14, delay: 0.16 });
    }
  }

  playCountdown(number) {
    this.playSe("countdown", { frequency: 620 + number * 22, volume: 0.32 });
  }

  playJingle(name) {
    const patterns = {
      gameStart: [523.25, 659.25, 783.99],
      stageStart: [392, 523.25, 659.25],
      stageClear: [659.25, 783.99, 1046.5],
      stageUp: [523.25, 783.99, 1174.66],
      gameOver: [261.63, 220, 196],
      allClear: [783.99, 987.77, 1318.51, 1567.98],
      newRecord: [1046.5, 1318.51, 1760],
      achievement: [587.33, 739.99, 987.77]
    };
    const pattern = patterns[name] || patterns.achievement;
    pattern.forEach((frequency, index) => {
      this.playTone({
        frequency,
        duration: 0.16,
        type: index % 2 === 0 ? "triangle" : "sine",
        volume: 0.22,
        delay: index * 0.11
      });
    });
  }

  playFeverStartSequence() {
    this.playSe("feverStart");
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      this.playTone({
        frequency,
        duration: 0.16,
        type: index < 3 ? "triangle" : "sawtooth",
        volume: 0.22 + index * 0.025,
        delay: index * 0.07
      });
    });
    this.playTone({ frequency: 98, duration: 0.28, type: "triangle", volume: 0.26, delay: 0.05 });
  }

  playFeverEndSequence() {
    [659.25, 523.25, 392].forEach((frequency, index) => {
      this.playTone({
        frequency,
        duration: 0.16,
        type: "sine",
        volume: 0.18,
        delay: index * 0.08
      });
    });
  }

  playSkill(skillId) {
    const skillSounds = {
      colorBurst: { frequencies: [392, 523.25, 783.99], type: "sawtooth", volume: 0.34 },
      freeze: { frequencies: [880, 659.25, 523.25], type: "sine", volume: 0.3 },
      colorShift: { frequencies: [523.25, 659.25, 783.99, 1046.5], type: "triangle", volume: 0.3 },
      allClear: { frequencies: [130.81, 261.63, 523.25, 1046.5], type: "sawtooth", volume: 0.42 }
    };
    const config = skillSounds[skillId] || skillSounds.colorBurst;
    config.frequencies.forEach((frequency, index) => {
      this.playTone({
        frequency,
        duration: skillId === "allClear" ? 0.32 : 0.2,
        type: config.type,
        volume: config.volume,
        delay: index * (skillId === "allClear" ? 0.08 : 0.06)
      });
    });
  }

  playAllClearSequence() {
    this.silenceBriefly(0.2);
    window.setTimeout(() => {
      this.playSkill("allClear");
      this.playTone({ frequency: 82.41, duration: 0.42, type: "sawtooth", volume: 0.46 });
      for (let i = 0; i < 8; i += 1) {
        this.playTone({
          frequency: 420 + i * 88,
          duration: 0.08,
          type: i % 2 === 0 ? "triangle" : "sine",
          volume: 0.2,
          delay: 0.08 + i * 0.035
        });
      }
      this.playJingle("allClear");
    }, 210);
  }
}

const audio = new AudioManager(AUDIO_ASSETS);

const GAME_VERSION = "0.9";
const GAME_STATE = {
  TITLE: "title",
  SKILL_SELECT: "skill_select",
  READY: "ready",
  PLAYING: "playing",
  PAUSED: "paused",
  EXIT_CONFIRM: "exit_confirm",
  REWARD: "reward",
  GAME_OVER: "game_over"
};

const GAME_CONFIG = {
  baseSeconds: 60,
  targetCount: 55,
  spikeCount: 3,
  missionTarget: 30,
  missionRewardSeconds: 5,
  stageScoreBase: 10000,
  stageTargetExponent: 1.7,
  maxStage: 10,
  fever: {
    duration: 10,
    scoreMultiplier: 1.5,
    gainByChain: {
      small: 10,
      medium: 18,
      large: 28,
      huge: 40
    },
    boostPerLevel: 0.1
  },
  upgrades: {
    chainBonusMaxLevel: 3,
    feverBoostMaxLevel: 3,
    rainbowMaxLevel: 3,
    goldenMaxLevel: 3,
    chainBonusPerLevel: 0.1,
    nextStageExtraSeconds: 5
  },
  specialPuni: {
    rainbow: {
      chancePerLevel: 0.009,
      maxChance: 0.03
    },
    golden: {
      chancePerLevel: 0.007,
      maxChance: 0.028,
      radiusMin: 13,
      radiusMax: 17,
      spawnSpeedMultiplier: 1.28,
      driftSpeedMultiplier: 1.15,
      ageSpeedIncrease: 0.035,
      lifespanMin: 9,
      lifespanMax: 13,
      scoreBonus: 1200
    }
  },
  stageDifficulty: {
    speedIncreasePerStage: 0.055,
    spikeCountByStage: [
      { fromStage: 7, count: 6 },
      { fromStage: 4, count: 5 },
      { fromStage: 2, count: 4 }
    ]
  },
  gimmicks: {
    current: {
      force: 7,
      sway: 3
    },
    wind: {
      force: 8,
      interval: 4.8,
      verticalSway: 2.2
    },
    gravity: {
      force: 7.5
    }
  },
  skill: {
    maxLevel: 3,
    scoreMultiplier: 1,
    gainByChain: {
      small: 2,
      medium: 6,
      large: 10,
      huge: 16
    },
    freezeSecondsByLevel: [0, 3, 5, 7],
    colorShiftSecondsByLevel: [0, 2, 3, 5],
    allClearRatiosByLevel: [0, 0.5, 0.8, 1]
  },
  boardSafety: {
    checkInterval: 1.4,
    minChainSize: 3,
    maxLinkDistance: 210,
    spikeDetachDistance: 26,
    spikeRepelForce: 220,
    rescueClusterRadius: 34,
    rescueSearchAttempts: 80
  }
};

const SKILLS = [
  {
    id: "colorBurst",
    name: "COLOR BURST",
    description: "Erase the current chain color."
  },
  {
    id: "freeze",
    name: "FREEZE",
    description: "Stop all puni for a short time."
  },
  {
    id: "colorShift",
    name: "COLOR SHIFT",
    description: "Make normal puni share one color."
  },
  {
    id: "allClear",
    name: "ALL CLEAR",
    description: "Blast away many normal puni."
  }
];

const STAGE_THEMES = [
  {
    stage: 1,
    name: "SPRING",
    gimmick: "none",
    colors: {
      backgroundA: "#fdf3f8",
      backgroundB: "#e9f9ff",
      backgroundC: "#f2fff1",
      cardA: "#f9eefa",
      cardB: "#e4f8ff",
      cardC: "#edfce9",
      accent: "#ffaec6",
      accentSoft: "#a5e6d8"
    }
  },
  {
    stage: 2,
    name: "OCEAN",
    gimmick: "none",
    colors: {
      backgroundA: "#e8f8ff",
      backgroundB: "#dff7f3",
      backgroundC: "#f2fbff",
      cardA: "#e9f9ff",
      cardB: "#ddf7f2",
      cardC: "#f7fdff",
      accent: "#85d9ca",
      accentSoft: "#9ecfff"
    }
  },
  {
    stage: 3,
    name: "FOREST",
    gimmick: "none",
    colors: {
      backgroundA: "#f2fff1",
      backgroundB: "#e1f7df",
      backgroundC: "#fff7e8",
      cardA: "#effceb",
      cardB: "#e3f6df",
      cardC: "#fff9ed",
      accent: "#91d89c",
      accentSoft: "#ffd986"
    }
  },
  {
    stage: 4,
    name: "SUNSET",
    gimmick: "wind",
    colors: {
      backgroundA: "#fff0df",
      backgroundB: "#ffe3ec",
      backgroundC: "#e9f0ff",
      cardA: "#fff2df",
      cardB: "#ffe5ec",
      cardC: "#eef3ff",
      accent: "#ffb06f",
      accentSoft: "#ffadc5"
    }
  },
  {
    stage: 5,
    name: "NIGHT",
    gimmick: "none",
    colors: {
      backgroundA: "#edf0ff",
      backgroundB: "#e5e8fb",
      backgroundC: "#f8efff",
      cardA: "#eef1ff",
      cardB: "#e6eafd",
      cardC: "#fbf2ff",
      accent: "#9aa8f7",
      accentSoft: "#d8b9ff"
    }
  },
  {
    stage: 6,
    name: "CRYSTAL",
    gimmick: "none",
    colors: {
      backgroundA: "#effbff",
      backgroundB: "#eef2ff",
      backgroundC: "#f8ffff",
      cardA: "#effbff",
      cardB: "#eef2ff",
      cardC: "#f8ffff",
      accent: "#b9c9ff",
      accentSoft: "#a7e6d8"
    }
  },
  {
    stage: 7,
    name: "STORM",
    gimmick: "wind",
    colors: {
      backgroundA: "#eef2f8",
      backgroundB: "#dde8f2",
      backgroundC: "#f7f1ff",
      cardA: "#f0f4fa",
      cardB: "#e0ebf4",
      cardC: "#f7f1ff",
      accent: "#9cb1cc",
      accentSoft: "#d8b9ff"
    }
  },
  {
    stage: 8,
    name: "LAVA",
    gimmick: "wind",
    colors: {
      backgroundA: "#fff1e6",
      backgroundB: "#ffe6dc",
      backgroundC: "#fff8e2",
      cardA: "#fff0e4",
      cardB: "#ffe8df",
      cardC: "#fff8e5",
      accent: "#ff9d7a",
      accentSoft: "#ffd986"
    }
  },
  {
    stage: 9,
    name: "GALAXY",
    gimmick: "gravity",
    colors: {
      backgroundA: "#f2efff",
      backgroundB: "#e6e8ff",
      backgroundC: "#fff0fb",
      cardA: "#f4f0ff",
      cardB: "#e8eaff",
      cardC: "#fff2fb",
      accent: "#bd94ed",
      accentSoft: "#91a6f4"
    }
  },
  {
    stage: 10,
    name: "RAINBOW",
    gimmick: "gravity",
    colors: {
      backgroundA: "#fff0f6",
      backgroundB: "#effbff",
      backgroundC: "#f3fff1",
      cardA: "#fff1f7",
      cardB: "#effbff",
      cardC: "#f4fff1",
      accent: "#ffaec6",
      accentSoft: "#b9c9ff"
    }
  }
];

const HIGH_SCORE_KEY = "puniHighScore";
const REWARDS = [
  {
    id: "time",
    title: "TIME +5s",
    description: "Next stage starts with 65 seconds."
  },
  {
    id: "chain",
    title: "CHAIN BONUS",
    description: "Long chains score more."
  },
  {
    id: "fever",
    title: "FEVER BOOST",
    description: "Fever gauge fills faster."
  },
  {
    id: "rainbow",
    title: "RAINBOW PUNI UP",
    description: "Rainbow puni may appear."
  },
  {
    id: "golden",
    title: "GOLDEN PUNI UP",
    description: "Fast golden puni may appear."
  }
];

let puni = [];
let spikes = [];
let burstEffects = [];
let popParticles = [];
let scorePopups = [];
let chainNotices = [];
let score = 0;
let removedTotal = 0;
let timeLeft = GAME_CONFIG.baseSeconds;
let currentStage = 1;
let missionCleared = false;
let missionNoticeTimer = 0;
let screenFlash = 0;
let stageTransitionTimer = 0;
let stageBanner = null;
let stageGimmickTime = 0;
let lastCountdownSecond = null;
let timeupBgmActive = false;
let feverGauge = 0;
let feverActive = false;
let feverTimer = 0;
let feverNoticeTimer = 0;
let highScoreData = { highScore: 0, highStage: 1 };
let playerUpgrades = createDefaultUpgrades();
let rewardChoices = [];
let rewardChoosing = false;
let rewardPresentTimer = 0;
let rewardNextStage = 0;
let titleActive = true;
let titleStarting = false;
let titlePuni = [];
let titleParticles = [];
let titleWidth = 0;
let titleHeight = 0;
let selectedSkillId = null;
let skillSelecting = false;
let skillGauge = 0;
let skillLevel = 0;
let skillFreezeTimer = 0;
let colorShiftTimer = 0;
let colorShiftColor = 0;
let skillCastDelay = 0;
let pendingSkill = null;
let skillEffectTimer = 0;
let skillEffect = null;
let screenShake = 0;
let boardSafetyTimer = 0;
let resultScoreDisplay = 0;
let resultScoreTarget = 0;
let resultAnimating = false;
let lastTime = 0;
let gameState = GAME_STATE.TITLE;
let prePauseState = GAME_STATE.PLAYING;
let paused = false;
let gameOver = false;
let selected = [];
let selectedColor = null;
let pointer = null;
let lastPointer = null;
let playWidth = 0;
let playHeight = 0;
let animationId = null;

function init(showTitle = true) {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  score = 0;
  removedTotal = 0;
  timeLeft = GAME_CONFIG.baseSeconds;
  currentStage = 1;
  missionCleared = false;
  missionNoticeTimer = 0;
  stageTransitionTimer = 0;
  stageBanner = null;
  stageGimmickTime = 0;
  lastCountdownSecond = null;
  timeupBgmActive = false;
  feverGauge = 0;
  feverActive = false;
  feverTimer = 0;
  feverNoticeTimer = 0;
  highScoreData = loadHighScore();
  playerUpgrades = createDefaultUpgrades();
  rewardChoices = [];
  rewardChoosing = false;
  rewardPresentTimer = 0;
  rewardNextStage = 0;
  titleActive = showTitle;
  titleStarting = false;
  selectedSkillId = null;
  skillSelecting = !showTitle;
  skillGauge = 0;
  skillLevel = 0;
  skillFreezeTimer = 0;
  colorShiftTimer = 0;
  colorShiftColor = 0;
  skillCastDelay = 0;
  pendingSkill = null;
  skillEffectTimer = 0;
  skillEffect = null;
  screenShake = 0;
  boardSafetyTimer = 0;
  resultScoreDisplay = 0;
  resultScoreTarget = 0;
  resultAnimating = false;
  gameState = showTitle ? GAME_STATE.TITLE : GAME_STATE.SKILL_SELECT;
  prePauseState = GAME_STATE.PLAYING;
  paused = false;
  gameOver = false;
  selected = [];
  selectedColor = null;
  pointer = null;
  lastPointer = null;
  puni = [];
  spikes = [];
  burstEffects = [];
  popParticles = [];
  scorePopups = [];
  chainNotices = [];
  screenFlash = 0;
  audio.stopBgm(0.2);
  gameCard.classList.remove("fever-active");
  overlay.classList.add("hidden");
  overlay.classList.remove("pause-overlay");
  resultPanel.classList.add("hidden");
  rewardPanel.classList.add("hidden");
  skillSelectPanel.classList.toggle("hidden", showTitle);
  pausePanel.classList.add("hidden");
  confirmExitPanel.classList.add("hidden");
  rewardOptions.innerHTML = "";
  skillOptions.innerHTML = "";
  recordText.classList.remove("show");
  recordText.textContent = "";
  missionNotice.classList.remove("show");
  missionNotice.textContent = "";
  pauseButton.textContent = "II";
  resizeCanvas();
  resizeTitleCanvas();
  applyThemeToUI();

  for (let i = 0; i < GAME_CONFIG.spikeCount; i += 1) {
    spikes.push(createSpike());
  }

  for (let i = 0; i < GAME_CONFIG.targetCount; i += 1) {
    puni.push(createPuni());
  }
  ensurePlayableBoard(true);

  updateHud();
  if (showTitle) {
    showTitleScreen();
  } else {
    hideTitleScreen();
    showSkillSelect();
  }
  lastTime = performance.now();
  animationId = requestAnimationFrame(loop);
}

function setGameState(nextState) {
  gameState = nextState;
  paused = nextState === GAME_STATE.PAUSED || nextState === GAME_STATE.EXIT_CONFIRM;
  gameOver = nextState === GAME_STATE.GAME_OVER;
  skillSelecting = nextState === GAME_STATE.SKILL_SELECT;
  rewardChoosing = nextState === GAME_STATE.REWARD;
  pauseButton.textContent = paused ? "▶" : "II";
  updateSkillUI();
}

function hideOverlayPanels() {
  resultPanel.classList.add("hidden");
  rewardPanel.classList.add("hidden");
  skillSelectPanel.classList.add("hidden");
  pausePanel.classList.add("hidden");
  confirmExitPanel.classList.add("hidden");
}

function clearActiveInput() {
  selected = [];
  selectedColor = null;
  pointer = null;
  lastPointer = null;
}

function isPauseAllowed() {
  return gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.READY;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  playWidth = rect.width;
  playHeight = rect.height;
  canvas.width = Math.floor(playWidth * dpr);
  canvas.height = Math.floor(playHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resizeTitleCanvas() {
  const rect = titleCanvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  titleWidth = rect.width;
  titleHeight = rect.height;
  titleCanvas.width = Math.floor(titleWidth * dpr);
  titleCanvas.height = Math.floor(titleHeight * dpr);
  titleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createPuni() {
  const radius = random(15, 21);
  const speedMultiplier = getStageSpeedMultiplier();
  const variant = choosePuniVariant();
  const goldenConfig = GAME_CONFIG.specialPuni.golden;
  const variantSpeed = variant === "golden" ? goldenConfig.spawnSpeedMultiplier : 1;
  const piece = createFloatingPiece({
    radius: variant === "golden" ? random(goldenConfig.radiusMin, goldenConfig.radiusMax) : radius,
    color: variant === "normal" ? Math.floor(Math.random() * COLORS.length) : 0,
    type: "normal",
    variant,
    speedMin: 11 * speedMultiplier * variantSpeed,
    speedMax: 24 * speedMultiplier * variantSpeed
  });

  if (!skillSelecting && !gameOver) {
    if (variant === "golden") audio.playSe("goldenSpawn");
    if (variant === "rainbow") audio.playSe("rainbowSpawn");
  }

  return piece;
}

function createDefaultUpgrades() {
  return {
    nextStageExtraSeconds: 0,
    chainBonusLevel: 0,
    feverBoostLevel: 0,
    rainbowLevel: 0,
    goldenLevel: 0
  };
}

function choosePuniVariant() {
  const rainbowConfig = GAME_CONFIG.specialPuni.rainbow;
  const goldenConfig = GAME_CONFIG.specialPuni.golden;
  const rainbowChance = Math.min(rainbowConfig.maxChance, playerUpgrades.rainbowLevel * rainbowConfig.chancePerLevel);
  const goldenChance = Math.min(goldenConfig.maxChance, playerUpgrades.goldenLevel * goldenConfig.chancePerLevel);
  const roll = Math.random();

  if (playerUpgrades.goldenLevel > 0 && roll < goldenChance) return "golden";
  if (playerUpgrades.rainbowLevel > 0 && roll < goldenChance + rainbowChance) return "rainbow";
  return "normal";
}

function createSpike() {
  const speedMultiplier = getStageSpeedMultiplier();
  return createFloatingPiece({
    radius: random(17, 22),
    color: -1,
    type: "spike",
    speedMin: 7 * speedMultiplier,
    speedMax: 16 * speedMultiplier
  });
}

function createFloatingPiece(options) {
  const radius = options.radius;
  let x = random(radius, Math.max(radius, playWidth - radius));
  let y = random(radius, Math.max(radius, playHeight - radius));
  const existing = getAllPieces();

  for (let attempt = 0; attempt < 90; attempt += 1) {
    const tooClose = existing.some((other) => {
      const extraGap = other.type === "spike" || options.type === "spike" ? GAME_CONFIG.boardSafety.spikeDetachDistance : 4;
      return distance(x, y, other.x, other.y) < radius + other.r + extraGap;
    });
    if (!tooClose) break;
    x = random(radius, Math.max(radius, playWidth - radius));
    y = random(radius, Math.max(radius, playHeight - radius));
  }

  const angle = random(0, Math.PI * 2);
  const speed = random(options.speedMin, options.speedMax);
  return {
    x,
    y,
    r: radius,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color: options.color,
    type: options.type,
    variant: options.variant || "normal",
    wobble: random(0, Math.PI * 2),
    scale: 1,
    alpha: 1,
    press: 0,
    hitFlash: 0,
    age: 0,
    removeLife: 0,
    lifespan: options.variant === "golden" ? random(GAME_CONFIG.specialPuni.golden.lifespanMin, GAME_CONFIG.specialPuni.golden.lifespanMax) : Infinity,
    removing: false
  };
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
  lastTime = now;
  updateGameOverAnimation(dt);

  if (titleActive) {
    updateTitle(dt);
    drawTitle();
    animationId = requestAnimationFrame(loop);
    return;
  }

  if (!paused && !gameOver && skillSelecting) {
    updateEffectsOnly(dt);
  } else if (!paused && !gameOver && rewardChoosing) {
    updateRewardPresent(dt);
    updateEffectsOnly(dt);
  } else if (!paused && !gameOver && skillCastDelay > 0) {
    updateSkillCastDelay(dt);
    updateEffectsOnly(dt);
  } else if (!paused && !gameOver && skillFreezeTimer > 0) {
    updateTimer(dt);
    updateFever(dt);
    updateSkillTimers(dt);
    updateBurstEffects(dt);
    updatePopParticles(dt);
    updateScorePopups(dt);
    updateChainNotices(dt);
    updateScreenFlash(dt);
    updateMissionNotice(dt);
    updateSkillEffect(dt);
  } else if (!paused && !gameOver && stageTransitionTimer > 0) {
    updateStageTransition(dt);
    updatePuni(dt);
    updateBurstEffects(dt);
    updatePopParticles(dt);
    updateScorePopups(dt);
    updateChainNotices(dt);
    updateScreenFlash(dt);
    updateMissionNotice(dt);
  } else if (!paused && !gameOver) {
    updateTimer(dt);
    updateFever(dt);
    updateSkillTimers(dt);
    updatePuni(dt);
    updateBurstEffects(dt);
    updatePopParticles(dt);
    updateScorePopups(dt);
    updateChainNotices(dt);
    updateScreenFlash(dt);
    updateMissionNotice(dt);
    updateSkillEffect(dt);
    const touchedSpike = selectedTouchesSpike();
    if (selected.length > 0 && touchedSpike) {
      failChain(null, touchedSpike);
    }
  }

  draw();
  animationId = requestAnimationFrame(loop);
}

function updateEffectsOnly(dt) {
  updateBurstEffects(dt);
  updatePopParticles(dt);
  updateScorePopups(dt);
  updateChainNotices(dt);
  updateScreenFlash(dt);
  updateMissionNotice(dt);
  updateSkillEffect(dt);
}

function showTitleScreen() {
  titleActive = true;
  titleStarting = false;
  gameState = GAME_STATE.TITLE;
  titleScreen.classList.remove("hidden", "starting");
  resizeTitleCanvas();
  overlay.classList.add("hidden");
  resultPanel.classList.add("hidden");
  rewardPanel.classList.add("hidden");
  skillSelectPanel.classList.add("hidden");
  versionText.textContent = `Version ${GAME_VERSION}`;
  updateTitleBestUI();
  createTitlePuni();
  drawTitle();
  if (audio.context) {
    audio.playTitleBgm();
  }
}

function hideTitleScreen() {
  titleActive = false;
  titleStarting = false;
  titleScreen.classList.add("hidden");
  titleScreen.classList.remove("starting");
  titleModal.classList.add("hidden");
}

function updateTitleBestUI() {
  const best = loadHighScore();
  titleBestScore.textContent = formatNumber(best.highScore);
  titleBestStage.textContent = best.highStage.toString();
}

function createTitlePuni() {
  titlePuni = [];
  titleParticles = [];
  const count = 8;

  for (let i = 0; i < count; i += 1) {
    const radius = random(18, 28);
    let x = random(radius + 18, Math.max(radius + 18, titleWidth - radius - 18));
    let y = random(185, Math.max(230, titleHeight - 110));

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const tooClose = titlePuni.some((p) => distance(x, y, p.x, p.y) < radius + p.r + 18);
      if (!tooClose) break;
      x = random(radius + 18, Math.max(radius + 18, titleWidth - radius - 18));
      y = random(185, Math.max(230, titleHeight - 110));
    }

    const angle = random(0, Math.PI * 2);
    const speed = random(6, 15);
    titlePuni.push({
      x,
      y,
      r: radius,
      color: Math.floor(Math.random() * COLORS.length),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      wobble: random(0, Math.PI * 2),
      squash: 0,
      rotation: random(-0.08, 0.08),
      spin: 0,
      bounce: 0
    });
  }
}

function updateTitle(dt) {
  for (const p of titlePuni) {
    p.wobble += dt * 1.3;
    const sway = 3.4 + Math.sin(p.wobble * 0.7) * 1.4;
    p.vx += Math.sin(p.wobble) * dt * sway;
    p.vy += Math.cos(p.wobble * 0.8) * dt * sway;
    const speed = Math.hypot(p.vx, p.vy);
    const maxSpeed = 18;
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }

    p.x += p.vx * dt;
    p.y += (p.vy + Math.sin(p.wobble * 1.2) * 6) * dt;
    p.rotation += p.spin * dt;
    p.spin *= Math.pow(0.1, dt);
    p.squash = Math.max(0, p.squash - dt * 3.6);
    p.bounce = Math.max(0, p.bounce - dt * 2.8);
    bounceTitlePuni(p);
  }

  for (const particle of titleParticles) {
    particle.life += dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 12 * dt;
    particle.alpha = Math.max(0, 1 - particle.life * 2.6);
  }
  titleParticles = titleParticles.filter((particle) => particle.alpha > 0.02);
}

function bounceTitlePuni(p) {
  const top = p.r + 92;
  const bottom = titleHeight - p.r - 44;
  if (p.x < p.r + 10) {
    p.x = p.r + 10;
    p.vx = Math.abs(p.vx);
  } else if (p.x > titleWidth - p.r - 10) {
    p.x = titleWidth - p.r - 10;
    p.vx = -Math.abs(p.vx);
  }

  if (p.y < top) {
    p.y = top;
    p.vy = Math.abs(p.vy);
  } else if (p.y > bottom) {
    p.y = bottom;
    p.vy = -Math.abs(p.vy);
  }
}

function drawTitle() {
  titleCtx.clearRect(0, 0, titleWidth, titleHeight);
  drawTitleBackground();

  for (const p of titlePuni) {
    drawTitlePuni(p);
  }

  drawTitleParticles();
}

function drawTitleBackground() {
  const now = performance.now() * 0.001;
  titleCtx.save();
  titleCtx.globalAlpha = 0.42;
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 73 + now * 10) % (titleWidth + 80)) - 40;
    const y = ((i * 97 + Math.sin(now + i) * 18) % (titleHeight + 80)) - 40;
    titleCtx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.46)";
    titleCtx.beginPath();
    titleCtx.arc(x, y, 2 + (i % 4), 0, Math.PI * 2);
    titleCtx.fill();
  }
  titleCtx.restore();
}

function drawTitlePuni(p) {
  const palette = COLORS[p.color];
  const breathe = Math.sin(p.wobble * 1.15) * 0.025;
  const bounceScale = 1 + Math.sin(p.bounce * Math.PI) * 0.13;
  const squashX = 1 + p.squash * 0.24 + breathe;
  const squashY = 1 - p.squash * 0.17 - breathe * 0.7;

  titleCtx.save();
  titleCtx.translate(p.x, p.y);
  titleCtx.rotate(p.rotation);
  titleCtx.scale(squashX * bounceScale, squashY / Math.max(0.7, bounceScale));

  const gradient = titleCtx.createRadialGradient(-p.r * 0.35, -p.r * 0.45, p.r * 0.2, 0, 0, p.r * 1.15);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.2, palette.fill);
  gradient.addColorStop(0.68, palette.fill);
  gradient.addColorStop(1, palette.shade);

  drawPuniEars(titleCtx, p.r, palette, p.wobble, p.squash, 0);

  titleCtx.fillStyle = gradient;
  drawPuniBodyPath(titleCtx, p.r * 1.04, p.r * 0.95, Math.sin(p.wobble) * 0.08);
  titleCtx.fill();

  titleCtx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  titleCtx.lineWidth = Math.max(1.4, p.r * 0.075);
  titleCtx.stroke();

  titleCtx.globalAlpha = 0.7;
  titleCtx.fillStyle = "#ffffff";
  titleCtx.beginPath();
  titleCtx.ellipse(-p.r * 0.35, -p.r * 0.42, p.r * 0.22, p.r * 0.13, -0.45, 0, Math.PI * 2);
  titleCtx.fill();

  titleCtx.globalAlpha = 1;
  titleCtx.fillStyle = palette.eye;
  titleCtx.beginPath();
  titleCtx.arc(-p.r * 0.28, -p.r * 0.04, p.r * 0.085, 0, Math.PI * 2);
  titleCtx.arc(p.r * 0.28, -p.r * 0.04, p.r * 0.085, 0, Math.PI * 2);
  titleCtx.fill();
  titleCtx.restore();
}

function drawTitleParticles() {
  titleCtx.save();
  for (const particle of titleParticles) {
    titleCtx.globalAlpha = particle.alpha;
    titleCtx.fillStyle = particle.color;
    titleCtx.beginPath();
    titleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    titleCtx.fill();
  }
  titleCtx.restore();
}

function updateTimer(dt) {
  timeLeft = Math.max(0, timeLeft - dt);
  updateCountdownAudio();
  if (timeLeft <= 0) {
    endGame();
  }
  updateHud();
}

function updateCountdownAudio() {
  if (gameOver || rewardChoosing || skillSelecting || stageTransitionTimer > 0) return;

  const remaining = Math.ceil(timeLeft);
  if (remaining > 5) {
    lastCountdownSecond = null;
    if (timeupBgmActive) {
      timeupBgmActive = false;
      if (feverActive) {
        audio.playFeverBgm();
      } else {
        audio.resumeStageBgm();
      }
    }
    return;
  }

  if (!timeupBgmActive && remaining > 0) {
    timeupBgmActive = true;
    audio.playTimeupBgm();
  }

  if (remaining > 0 && remaining !== lastCountdownSecond) {
    lastCountdownSecond = remaining;
    audio.duckBgm(0.92);
    audio.playCountdown(remaining);
  } else if (remaining <= 0 && lastCountdownSecond !== 0) {
    lastCountdownSecond = 0;
    audio.playSe("countdownEnd");
  }
}

function updatePuni(dt) {
  const speedMultiplier = getStageSpeedMultiplier();
  applyStageGimmick(dt);
  for (const p of getAllPieces()) {
    p.wobble += dt * 2.2;
    p.age += dt;
    if (p.hitFlash > 0) {
      p.hitFlash = Math.max(0, p.hitFlash - dt * 3.2);
    }
    if (p.press > 0) {
      p.press = Math.max(0, p.press - dt * 8.5);
    }

    if (p.variant === "golden" && p.age > p.lifespan) {
      p.removing = true;
    }

    if (p.removing) {
      p.removeLife += dt;
      p.scale = Math.max(0, p.scale - dt * 5.4);
      p.alpha = Math.max(0, p.alpha - dt * 4.8);
      continue;
    }

    const goldenConfig = GAME_CONFIG.specialPuni.golden;
    const goldenBoost = p.variant === "golden" ? goldenConfig.driftSpeedMultiplier + p.age * goldenConfig.ageSpeedIncrease : 1;
    const drift = (p.type === "spike" ? 4 : 6) * speedMultiplier * goldenBoost;
    const maxSpeed = (p.type === "spike" ? 20 : 32) * speedMultiplier * goldenBoost;
    p.vx += Math.sin(p.wobble) * dt * drift;
    p.vy += Math.cos(p.wobble * 0.9) * dt * drift;
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    bounceAtEdges(p);
  }

  pushApart(dt);
  repelSpikesFromPuni(dt);
  puni = puni.filter((p) => p.alpha > 0.02);

  while (puni.length < GAME_CONFIG.targetCount) {
    puni.push(createPuni());
  }
  updateBoardSafety(dt);
}

function applyStageGimmick(dt) {
  stageGimmickTime += dt;
  const gimmick = getCurrentGimmick();
  if (gimmick === "none") return;

  if (gimmick === "current") {
    applyCurrentGimmick(dt);
  } else if (gimmick === "wind") {
    applyWindGimmick(dt);
  } else if (gimmick === "gravity") {
    applyGravityGimmick(dt);
  }
}

function applyCurrentGimmick(dt) {
  const config = GAME_CONFIG.gimmicks.current;
  const flowX = config.force + Math.sin(stageGimmickTime * 0.9) * config.sway;
  const flowY = Math.cos(stageGimmickTime * 0.7) * config.sway;

  for (const piece of getAllPieces()) {
    if (piece.removing) continue;
    piece.vx += flowX * dt;
    piece.vy += flowY * dt;
  }
}

function applyWindGimmick(dt) {
  const config = GAME_CONFIG.gimmicks.wind;
  const phase = Math.sin((stageGimmickTime / config.interval) * Math.PI * 2);
  const direction = phase >= 0 ? 1 : -1;
  const easing = 0.45 + Math.abs(phase) * 0.55;

  for (const piece of getAllPieces()) {
    if (piece.removing) continue;
    piece.vx += direction * config.force * easing * dt;
    piece.vy += Math.sin(stageGimmickTime * 1.4 + piece.wobble) * config.verticalSway * dt;
  }
}

function applyGravityGimmick(dt) {
  const config = GAME_CONFIG.gimmicks.gravity;
  const centerX = playWidth * 0.5;
  const centerY = playHeight * 0.48;

  for (const piece of getAllPieces()) {
    if (piece.removing) continue;
    const dx = centerX - piece.x;
    const dy = centerY - piece.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    piece.vx += (dx / dist) * config.force * dt;
    piece.vy += (dy / dist) * config.force * dt;
  }
}

function bounceAtEdges(p) {
  if (p.x < p.r) {
    p.x = p.r;
    p.vx = Math.abs(p.vx);
  } else if (p.x > playWidth - p.r) {
    p.x = playWidth - p.r;
    p.vx = -Math.abs(p.vx);
  }

  if (p.y < p.r) {
    p.y = p.r;
    p.vy = Math.abs(p.vy);
  } else if (p.y > playHeight - p.r) {
    p.y = playHeight - p.r;
    p.vy = -Math.abs(p.vy);
  }
}

function pushApart(dt) {
  const pieces = getAllPieces();

  for (let i = 0; i < pieces.length; i += 1) {
    const a = pieces[i];
    if (a.removing) continue;

    for (let j = i + 1; j < pieces.length; j += 1) {
      const b = pieces[j];
      if (b.removing) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.max(0.01, Math.hypot(dx, dy));
      const minDist = a.r + b.r - 4;
      if (dist >= minDist) continue;

      const push = (minDist - dist) * 0.5;
      const nx = dx / dist;
      const ny = dy / dist;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;
      a.vx -= nx * dt * 38;
      a.vy -= ny * dt * 38;
      b.vx += nx * dt * 38;
      b.vy += ny * dt * 38;
      bounceAtEdges(a);
      bounceAtEdges(b);
    }
  }
}

function repelSpikesFromPuni(dt) {
  const config = GAME_CONFIG.boardSafety;

  for (const spike of spikes) {
    if (spike.removing) continue;

    for (const p of puni) {
      if (p.removing) continue;

      const dx = p.x - spike.x;
      const dy = p.y - spike.y;
      const dist = Math.max(0.01, Math.hypot(dx, dy));
      const safeDistance = p.r + spike.r + config.spikeDetachDistance;
      if (dist >= safeDistance) continue;

      const nx = dx / dist;
      const ny = dy / dist;
      const push = (safeDistance - dist) * 0.45;
      p.x += nx * push;
      p.y += ny * push;
      spike.x -= nx * push;
      spike.y -= ny * push;
      p.vx += nx * config.spikeRepelForce * dt;
      p.vy += ny * config.spikeRepelForce * dt;
      spike.vx -= nx * config.spikeRepelForce * dt;
      spike.vy -= ny * config.spikeRepelForce * dt;
      bounceAtEdges(p);
      bounceAtEdges(spike);
    }
  }
}

function updateBoardSafety(dt) {
  if (skillSelecting || rewardChoosing || stageTransitionTimer > 0 || skillCastDelay > 0) return;

  boardSafetyTimer += dt;
  if (boardSafetyTimer < GAME_CONFIG.boardSafety.checkInterval) return;

  boardSafetyTimer = 0;
  ensurePlayableBoard(false);
}

function ensurePlayableBoard(force) {
  if (!force && hasPlayableChain()) return;
  if (force && hasPlayableChain()) return;
  createRescueChain();
}

function hasPlayableChain() {
  for (let color = 0; color < COLORS.length; color += 1) {
    if (getLargestPlayableGroup(color) >= GAME_CONFIG.boardSafety.minChainSize) {
      return true;
    }
  }
  return false;
}

function getLargestPlayableGroup(color) {
  const candidates = puni.filter((p) => !p.removing && (p.variant === "rainbow" || p.variant === "golden" || (p.variant === "normal" && getEffectivePuniColor(p) === color)));
  const visited = new Set();
  let largest = 0;

  for (const start of candidates) {
    if (visited.has(start)) continue;

    const queue = [start];
    visited.add(start);
    let count = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      count += 1;

      for (const next of candidates) {
        if (visited.has(next) || current === next) continue;
        if (!canLinkForBoardSafety(current, next, color)) continue;
        visited.add(next);
        queue.push(next);
      }
    }

    largest = Math.max(largest, count);
  }

  return largest;
}

function canLinkForBoardSafety(from, to, color) {
  if (distance(from.x, from.y, to.x, to.y) > GAME_CONFIG.boardSafety.maxLinkDistance) return false;
  return !isDirectPathBlockedForColor(from, to, color);
}

function isDirectPathBlockedForColor(from, to, color) {
  for (const spike of spikes) {
    if (distanceToSegment(spike.x, spike.y, from.x, from.y, to.x, to.y) <= spike.r + 5) {
      return true;
    }
  }

  for (const blocker of puni) {
    if (blocker === from || blocker === to || blocker.removing) continue;
    if (isWildcardPuni(blocker) || getEffectivePuniColor(blocker) === color) continue;
    if (distanceToSegment(blocker.x, blocker.y, from.x, from.y, to.x, to.y) <= blocker.r + 5) {
      return true;
    }
  }

  return false;
}

function createRescueChain() {
  const targets = puni.filter((p) => !p.removing && p.variant === "normal").slice(0, GAME_CONFIG.boardSafety.minChainSize);
  if (targets.length < GAME_CONFIG.boardSafety.minChainSize) return;

  const center = findSafeRescueCenter();
  const color = Math.floor(Math.random() * COLORS.length);
  const radius = GAME_CONFIG.boardSafety.rescueClusterRadius;

  targets.forEach((p, index) => {
    const angle = (index / targets.length) * Math.PI * 2;
    p.color = color;
    p.x = center.x + Math.cos(angle) * radius;
    p.y = center.y + Math.sin(angle) * radius;
    p.vx = Math.cos(angle) * random(8, 22);
    p.vy = Math.sin(angle) * random(8, 22);
    p.scale = 1;
    p.alpha = 1;
    p.removing = false;
    bounceAtEdges(p);
  });
}

function findSafeRescueCenter() {
  const margin = 58;
  let best = { x: playWidth * 0.5, y: playHeight * 0.5 };
  let bestScore = -Infinity;

  for (let attempt = 0; attempt < GAME_CONFIG.boardSafety.rescueSearchAttempts; attempt += 1) {
    const point = {
      x: random(margin, Math.max(margin, playWidth - margin)),
      y: random(margin, Math.max(margin, playHeight - margin))
    };
    const nearestSpike = spikes.reduce((nearest, spike) => Math.min(nearest, distance(point.x, point.y, spike.x, spike.y) - spike.r), Infinity);
    const nearestPuni = puni.reduce((nearest, p) => p.removing ? nearest : Math.min(nearest, distance(point.x, point.y, p.x, p.y) - p.r), Infinity);
    const score = nearestSpike * 1.8 + nearestPuni;
    if (score > bestScore) {
      best = point;
      bestScore = score;
    }
  }

  return best;
}

function draw() {
  ctx.clearRect(0, 0, playWidth, playHeight);
  applyScreenShake();
  drawBackgroundBubbles();
  drawGimmickFlow();
  drawFeverAura();
  drawSelectionLine();

  for (const spike of spikes) {
    drawSpike(spike);
  }

  for (const p of puni) {
    drawPuni(p, selected.includes(p), p === selected[0]);
  }

  drawBurstEffects();
  drawPopParticles();
  drawScreenFlash();
  drawScorePopups();
  drawChainNotices();
  drawFeverNotice();
  drawSkillEffect();
  drawStageBanner();
  ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
}

function applyScreenShake() {
  if (screenShake <= 0) return;
  const shake = screenShake * 7;
  ctx.translate(random(-shake, shake), random(-shake, shake));
}

function drawBackgroundBubbles() {
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 67 + performance.now() * 0.006) % (playWidth + 60)) - 30;
    const y = (i * 83) % playHeight;
    ctx.beginPath();
    ctx.arc(x, y, 8 + (i % 3) * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawGimmickFlow() {
  const gimmick = getCurrentGimmick();
  if (gimmick === "none") return;

  ctx.save();
  ctx.lineCap = "round";
  const accent = getCurrentTheme().colors.accent;

  if (gimmick === "current") {
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 5;
    ctx.strokeStyle = withAlpha(accent, 0.72);
    const offset = (stageGimmickTime * 22) % 110;
    for (let i = -1; i < 7; i += 1) {
      const y = i * 98 + offset;
      ctx.beginPath();
      ctx.moveTo(-30, y);
      ctx.bezierCurveTo(playWidth * 0.28, y - 26, playWidth * 0.62, y + 30, playWidth + 30, y - 8);
      ctx.stroke();
    }
  } else if (gimmick === "wind") {
    const direction = Math.sin((stageGimmickTime / GAME_CONFIG.gimmicks.wind.interval) * Math.PI * 2) >= 0 ? 1 : -1;
    ctx.globalAlpha = 0.24;
    ctx.lineWidth = 4;
    ctx.strokeStyle = withAlpha(accent, 0.72);
    const offset = (stageGimmickTime * 38) % 130;
    for (let i = -1; i < 6; i += 1) {
      const y = i * 116 + offset;
      ctx.beginPath();
      if (direction > 0) {
        ctx.moveTo(-20, y);
        ctx.lineTo(playWidth * 0.74, y - 24);
      } else {
        ctx.moveTo(playWidth + 20, y);
        ctx.lineTo(playWidth * 0.26, y - 24);
      }
      ctx.stroke();
    }
  } else if (gimmick === "gravity") {
    const pulse = 1 + Math.sin(stageGimmickTime * 1.8) * 0.08;
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = withAlpha(accent, 0.8);
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(playWidth * 0.5, playHeight * 0.48, (58 + i * 48) * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawFeverAura() {
  if (!feverActive && feverNoticeTimer <= 0) return;

  const now = performance.now();
  const pulse = 0.85 + Math.sin(now * 0.006) * 0.15;
  const alpha = feverActive ? 0.5 * pulse : 0.16 * feverNoticeTimer;

  ctx.save();
  const gradient = ctx.createRadialGradient(playWidth * 0.5, playHeight * 0.5, 20, playWidth * 0.5, playHeight * 0.5, playHeight * 0.78);
  gradient.addColorStop(0, `rgba(255, 235, 170, ${alpha})`);
  gradient.addColorStop(0.4, `rgba(255, 174, 198, ${alpha * 0.7})`);
  gradient.addColorStop(1, `rgba(185, 201, 255, ${alpha * 0.16})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, playWidth, playHeight);

  if (feverActive) {
    ctx.globalAlpha = 0.22 + pulse * 0.08;
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    const offset = (now * 0.05) % 180;
    const colors = [
      "rgba(255, 217, 134, 0.9)",
      "rgba(255, 174, 198, 0.85)",
      "rgba(185, 201, 255, 0.85)"
    ];
    for (let i = -2; i < 6; i += 1) {
      ctx.strokeStyle = colors[Math.abs(i) % colors.length];
      ctx.beginPath();
      ctx.moveTo(-80, i * 118 + offset);
      ctx.lineTo(playWidth + 80, i * 118 - 150 + offset);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawSelectionLine() {
  if (selected.length === 0) return;

  const chainStyle = getChainStyle();
  const chainColor = getSelectedChainColor();
  const pulse = selected.length >= 7 ? 1 + Math.sin(performance.now() * 0.01) * 0.12 : 1;
  const outerWidth = chainStyle.width * pulse + chainStyle.glow;
  const innerWidth = chainStyle.width * pulse;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (chainStyle.glow > 0) {
    ctx.lineWidth = outerWidth;
    ctx.strokeStyle = feverActive ? "rgba(255, 225, 150, 0.72)" : (chainStyle.useColorGlow ? chainColor.glow : "rgba(255, 255, 255, 0.58)");
    drawCurrentSelectionPath();
    ctx.stroke();
  }

  ctx.lineWidth = feverActive ? innerWidth + 2 : innerWidth;
  ctx.strokeStyle = feverActive ? "rgba(255, 248, 215, 0.95)" : (chainStyle.useColorLine ? chainColor.line : "rgba(255, 255, 255, 0.9)");
  drawCurrentSelectionPath();
  ctx.stroke();

  ctx.lineWidth = Math.max(3, innerWidth * 0.45);
  ctx.strokeStyle = "rgba(124, 155, 175, 0.2)";
  drawCurrentSelectionPath();
  ctx.stroke();
  ctx.restore();
}

function drawCurrentSelectionPath() {
  ctx.beginPath();
  selected.forEach((p, index) => {
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  if (pointer) ctx.lineTo(pointer.x, pointer.y);
}

function drawPuni(p, isSelected, isParent) {
  const palette = getPuniPalette(p);
  const selectedScale = isParent ? getParentScale() : (isSelected ? 1.08 : 1);
  const scale = p.scale * selectedScale;
  const radius = p.r * scale;
  const breathe = p.removing ? 0 : Math.sin(p.wobble * 1.15) * 0.025;
  const press = Math.max(p.press || 0, isSelected ? 0.18 : 0);
  const popHop = p.removing ? Math.max(0, 1 - (p.removeLife || 0) / 0.12) : 0;
  const squashX = 1 + press * 0.18 + breathe;
  const squashY = 1 - press * 0.14 - breathe * 0.7;
  const wobbleX = Math.sin(p.wobble) * radius * 0.035;
  const wobbleY = Math.cos(p.wobble * 1.15) * radius * 0.03;
  const bodyRotation = Math.sin(p.wobble) * 0.055;

  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.scale(squashX, squashY);

  if (isParent && selected.length >= 3) {
    drawParentRing(radius, palette);
  }

  if (p.variant === "golden") {
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.28;
    ctx.fillStyle = "rgba(255, 224, 120, 0.8)";
    ctx.beginPath();
    ctx.arc(0, 0, radius + 7 + Math.sin(performance.now() * 0.01) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const bodyGradient = createPuniBodyGradient(p, palette, radius, isSelected);

  drawPuniEars(ctx, radius, palette, p.wobble, press, popHop);

  ctx.fillStyle = bodyGradient;
  drawPuniBodyPath(ctx, radius + wobbleX, radius * 0.94 + wobbleY, bodyRotation);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.lineWidth = Math.max(1.2, radius * 0.075);
  ctx.stroke();

  ctx.globalAlpha = p.alpha * 0.48;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.32, -radius * 0.38, radius * 0.25, radius * 0.14, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = palette.eye;
  ctx.beginPath();
  ctx.arc(-radius * 0.25, -radius * 0.04, radius * 0.068, 0, Math.PI * 2);
  ctx.arc(radius * 0.25, -radius * 0.04, radius * 0.068, 0, Math.PI * 2);
  ctx.fill();

  if (p.variant === "golden") {
    drawGoldenPuniStar(ctx, radius);
  }

  if (isSelected) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPuniEars(renderCtx, radius, palette, wobble, press = 0, popHop = 0) {
  const earW = radius * 0.48;
  const earH = radius * (0.68 + popHop * 0.12);
  const baseY = -radius * 0.68;
  const sway = Math.sin(wobble * 1.25) * radius * 0.018;
  const spread = radius * (0.43 + press * 0.09 + popHop * 0.06);

  renderCtx.save();
  renderCtx.fillStyle = palette.fill;
  renderCtx.strokeStyle = "rgba(255, 255, 255, 0.74)";
  renderCtx.lineWidth = Math.max(1.1, radius * 0.065);
  drawPuniEar(renderCtx, -spread, baseY + sway, earW, earH, -1, press);
  drawPuniEar(renderCtx, spread, baseY - sway, earW, earH, 1, press);
  renderCtx.restore();
}

function drawPuniEar(renderCtx, x, y, width, height, direction, press) {
  const lean = direction * (width * (0.2 + press * 0.22));
  renderCtx.beginPath();
  renderCtx.moveTo(x - direction * width * 0.5, y + height * 0.5);
  renderCtx.quadraticCurveTo(x - direction * width * 0.42, y - height * 0.26, x + lean, y - height * 0.62);
  renderCtx.quadraticCurveTo(x + direction * width * 0.54, y - height * 0.18, x + direction * width * 0.48, y + height * 0.5);
  renderCtx.closePath();
  renderCtx.fill();
  renderCtx.stroke();
}

function drawPuniBodyPath(renderCtx, radiusX, radiusY, rotation = 0) {
  renderCtx.save();
  renderCtx.rotate(rotation);
  renderCtx.beginPath();
  renderCtx.moveTo(0, -radiusY);
  renderCtx.bezierCurveTo(radiusX * 0.72, -radiusY, radiusX * 1.08, -radiusY * 0.44, radiusX * 1.03, radiusY * 0.06);
  renderCtx.bezierCurveTo(radiusX * 0.98, radiusY * 0.7, radiusX * 0.58, radiusY * 1.02, 0, radiusY);
  renderCtx.bezierCurveTo(-radiusX * 0.58, radiusY * 1.02, -radiusX * 0.98, radiusY * 0.7, -radiusX * 1.03, radiusY * 0.06);
  renderCtx.bezierCurveTo(-radiusX * 1.08, -radiusY * 0.44, -radiusX * 0.72, -radiusY, 0, -radiusY);
  renderCtx.closePath();
  renderCtx.restore();
}

function drawGoldenPuniStar(renderCtx, radius) {
  const x = radius * 0.38;
  const y = -radius * 0.28;
  const outer = Math.max(3.2, radius * 0.17);
  const inner = outer * 0.48;

  renderCtx.save();
  renderCtx.fillStyle = "rgba(255, 255, 245, 0.88)";
  renderCtx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) renderCtx.moveTo(px, py);
    else renderCtx.lineTo(px, py);
  }
  renderCtx.closePath();
  renderCtx.fill();
  renderCtx.restore();
}

function drawSpike(spike) {
  const flash = spike.hitFlash || 0;
  const warning = getSpikeWarningLevel(spike);
  const radius = spike.r * (1 + flash * 0.18);
  const points = 14;

  ctx.save();
  ctx.translate(spike.x, spike.y);
  ctx.rotate(Math.sin(spike.wobble) * 0.08);

  if (warning > 0) {
    ctx.save();
    ctx.globalAlpha = warning * 0.52;
    ctx.strokeStyle = "rgba(228, 197, 255, 0.78)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius * (1.55 + warning * 0.3), 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = warning * 0.26;
    ctx.strokeStyle = "rgba(255, 229, 157, 0.82)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, radius * (1.85 + warning * 0.24), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (flash > 0) {
    ctx.save();
    ctx.globalAlpha = flash * 0.75;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, 0, radius * (1.22 + flash * 0.35), 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = flash * 0.46;
    ctx.fillStyle = "rgba(255, 229, 143, 0.72)";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const gradient = ctx.createRadialGradient(-radius * 0.3, -radius * 0.34, radius * 0.18, 0, 0, radius * 1.35);
  gradient.addColorStop(0, flash > 0 ? "#fff8cf" : "#f1edf8");
  gradient.addColorStop(0.58, flash > 0 ? "#c9a8ff" : "#9586b4");
  gradient.addColorStop(1, flash > 0 ? "#815cba" : "#665178");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  for (let i = 0; i < points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    const outer = i % 2 === 0 ? radius * 1.2 : radius * 0.92;
    const x = Math.cos(angle) * outer;
    const y = Math.sin(angle) * outer;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.34;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.3, -radius * 0.33, radius * 0.22, radius * 0.13, -0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#4d405f";
  ctx.beginPath();
  ctx.arc(-radius * 0.22, -radius * 0.03, radius * 0.055, 0, Math.PI * 2);
  ctx.arc(radius * 0.22, -radius * 0.03, radius * 0.055, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function getPuniPalette(p) {
  if (p.variant === "golden") {
    return { fill: "#ffd45a", shade: "#f0aa32", eye: "#20243a" };
  }

  if (p.variant === "rainbow") {
    return { fill: "#fdf8ff", shade: "#c8d8ff", eye: "#20243a" };
  }

  return COLORS[getEffectivePuniColor(p)];
}

function getEffectivePuniColor(p) {
  if (colorShiftTimer > 0 && p.type === "normal" && p.variant === "normal") {
    return colorShiftColor;
  }
  return p.color;
}

function createPuniBodyGradient(p, palette, radius, isSelected) {
  const bodyGradient = ctx.createRadialGradient(-radius * 0.35, -radius * 0.42, radius * 0.2, 0, 0, radius);

  if (p.variant === "rainbow") {
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.24, isSelected ? "#ffffff" : "#ffd7ec");
    bodyGradient.addColorStop(0.46, "#bff4e4");
    bodyGradient.addColorStop(0.66, "#ffe88d");
    bodyGradient.addColorStop(0.84, "#9fcaff");
    bodyGradient.addColorStop(1, "#dfa8ff");
    return bodyGradient;
  }

  bodyGradient.addColorStop(0, isSelected ? "#ffffff" : "#fffefd");
  bodyGradient.addColorStop(0.2, palette.fill);
  bodyGradient.addColorStop(0.68, palette.fill);
  bodyGradient.addColorStop(1, palette.shade);
  return bodyGradient;
}

function drawBurstEffects() {
  for (const effect of burstEffects) {
    const isSpikeEffect = effect.color === "spike";
    ctx.save();
    ctx.globalAlpha = effect.alpha;
    ctx.strokeStyle = isSpikeEffect ? "rgba(255, 241, 166, 0.95)" : "rgba(103, 78, 125, 0.65)";
    ctx.lineWidth = isSpikeEffect ? 5 : 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = effect.alpha * (isSpikeEffect ? 0.35 : 0.6);
    ctx.fillStyle = isSpikeEffect ? "rgba(255, 235, 126, 0.65)" : "rgba(255, 176, 201, 0.5)";
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawPopParticles() {
  for (const particle of popParticles) {
    ctx.save();
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawScorePopups() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const popup of scorePopups) {
    const scale = popup.fever ? 1 + Math.sin(popup.life * Math.PI * 4) * 0.05 : 1;
    ctx.globalAlpha = popup.alpha;
    ctx.save();
    ctx.translate(popup.x, popup.y);
    ctx.scale(scale, scale);
    ctx.font = popup.fever ? "900 30px system-ui, sans-serif" : "900 22px system-ui, sans-serif";
    ctx.lineWidth = popup.fever ? 8 : 5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
    ctx.strokeText(popup.text, 0, 0);
    ctx.fillStyle = popup.fever ? "#d58bdd" : "rgba(107, 126, 142, 0.95)";
    ctx.fillText(popup.text, 0, 0);

    if (popup.fever) {
      ctx.font = "900 15px system-ui, sans-serif";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
      ctx.strokeText("x1.5 FEVER SCORE", 0, 28);
      ctx.fillStyle = "#f0a048";
      ctx.fillText("x1.5 FEVER SCORE", 0, 28);
    }
    ctx.restore();
  }

  ctx.restore();
}

function drawChainNotices() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const notice of chainNotices) {
    const scale = 1 + Math.sin(notice.life * Math.PI * 3) * 0.04;
    ctx.save();
    ctx.globalAlpha = notice.alpha;
    ctx.translate(notice.x, notice.y);
    ctx.scale(scale, scale);
    ctx.font = `${notice.size}px system-ui, sans-serif`;
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeText(notice.text, 0, 0);
    ctx.fillStyle = notice.color;
    ctx.fillText(notice.text, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function drawFeverNotice() {
  if (!feverActive && feverNoticeTimer <= 0) return;

  const timerRatio = feverActive ? Math.max(0, Math.min(1, feverTimer / GAME_CONFIG.fever.duration)) : 0;
  const noticeAlpha = feverActive ? 0.92 : Math.min(1, feverNoticeTimer * 1.4);
  const pulse = 1 + Math.sin(performance.now() * 0.012) * 0.08;

  ctx.save();
  ctx.globalAlpha = noticeAlpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(playWidth * 0.5, 92);
  ctx.scale(pulse, pulse);
  ctx.font = "900 40px system-ui, sans-serif";
  ctx.lineWidth = 9;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeText("FEVER!", 0, 0);
  ctx.fillStyle = "#d58bdd";
  ctx.fillText("FEVER!", 0, 0);

  ctx.font = "900 21px system-ui, sans-serif";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeText("SCORE x1.5", 0, 34);
  ctx.fillStyle = "#f0a048";
  ctx.fillText("SCORE x1.5", 0, 34);

  if (feverActive) {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    ctx.fillRect(-66, 54, 132, 7);
    ctx.fillStyle = "rgba(255, 217, 134, 0.95)";
    ctx.fillRect(-66, 54, 132 * timerRatio, 7);
  }

  ctx.restore();
}

function drawSkillEffect() {
  if (!skillEffect || skillEffectTimer <= 0) return;

  const progress = 1 - skillEffectTimer / skillEffect.duration;
  const alpha = Math.min(1, skillEffectTimer * 2.4);
  const centerX = playWidth * 0.5;
  const centerY = playHeight * 0.46;
  const radius = 40 + progress * playHeight * (skillEffect.text === "ALL CLEAR!!" ? 0.85 : 0.62);

  ctx.save();
  ctx.globalAlpha = alpha * (skillEffect.phase === "charge" ? 0.42 : 0.62);
  ctx.fillStyle = skillEffect.glow;
  ctx.fillRect(0, 0, playWidth, playHeight);

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  ctx.lineWidth = skillEffect.text === "ALL CLEAR!!" ? 14 : 9;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.75;
  ctx.strokeStyle = skillEffect.color;
  ctx.lineWidth = skillEffect.text === "ALL CLEAR!!" ? 7 : 5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  const textScale = 1 + Math.sin(progress * Math.PI) * 0.14;
  ctx.translate(centerX, centerY);
  ctx.scale(textScale, textScale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${skillEffect.text === "ALL CLEAR!!" ? 38 : 31}px system-ui, sans-serif`;
  ctx.lineWidth = 9;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.strokeText(skillEffect.text, 0, 0);
  ctx.fillStyle = skillEffect.color;
  ctx.fillText(skillEffect.text, 0, 0);
  ctx.restore();
}

function drawScreenFlash() {
  if (screenFlash <= 0) return;

  ctx.save();
  ctx.globalAlpha = screenFlash * 0.22;
  const gradient = ctx.createRadialGradient(playWidth * 0.5, playHeight * 0.34, 20, playWidth * 0.5, playHeight * 0.36, playHeight * 0.72);
  gradient.addColorStop(0, "rgba(255, 246, 182, 0.85)");
  gradient.addColorStop(0.45, "rgba(255, 194, 223, 0.42)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, playWidth, playHeight);
  ctx.restore();
}

function drawStageBanner() {
  if (!stageBanner) return;

  const progress = Math.max(0, Math.min(1, stageTransitionTimer / stageBanner.duration));
  const fade = Math.min(1, progress * 4, (1 - progress) * 5 + 0.2);
  const scale = 1 + (1 - progress) * 0.18;
  const theme = getCurrentTheme();

  ctx.save();
  ctx.globalAlpha = Math.max(0, fade);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(playWidth * 0.5, playHeight * 0.43);
  ctx.scale(scale, scale);

  ctx.font = "900 46px system-ui, sans-serif";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeText(stageBanner.title, 0, 0);
  ctx.fillStyle = theme.colors.accent;
  ctx.fillText(stageBanner.title, 0, 0);

  ctx.font = "900 22px system-ui, sans-serif";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
  ctx.strokeText(stageBanner.subtitle, 0, 42);
  ctx.fillStyle = theme.colors.accentSoft;
  ctx.fillText(stageBanner.subtitle, 0, 42);
  ctx.restore();
}

function pointerDown(event) {
  if (paused || gameOver || rewardChoosing || skillSelecting || skillCastDelay > 0 || stageTransitionTimer > 0) return;
  audio.unlock();
  const pos = getPointerPosition(event);
  const hit = getPuniAt(pos.x, pos.y);
  if (!hit) return;

  event.preventDefault();
  if (event.pointerId !== undefined && canvas.setPointerCapture) {
    canvas.setPointerCapture(event.pointerId);
  }
  pointer = pos;
  lastPointer = pos;
  selected = [hit];
  hit.press = 1;
  selectedColor = isWildcardPuni(hit) ? null : getEffectivePuniColor(hit);
  audio.playChainStart();
  audio.playChainStep(1);
}

function handleTitlePointerDown(event) {
  if (!titleActive || titleStarting) return;
  audio.unlock();
  if (!audio.currentBgm || audio.currentBgm.key !== "title") {
    audio.playTitleBgm();
  }

  const rect = titleCanvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = point.clientX - rect.left;
  const y = point.clientY - rect.top;
  const hit = [...titlePuni].reverse().find((p) => distance(x, y, p.x, p.y) <= p.r + 10);
  if (!hit) return;

  event.preventDefault();
  const dx = hit.x - x || random(-1, 1);
  const dy = hit.y - y || -1;
  const length = Math.max(1, Math.hypot(dx, dy));
  hit.squash = 1;
  hit.bounce = 1;
  hit.vx += (dx / length) * 34;
  hit.vy += (dy / length) * 24 - 28;
  hit.spin += random(-2.4, 2.4);
  createTitleTapParticles(hit);
  audio.playSe("chainStart", { frequency: 260 + hit.color * 54, volume: 0.2 });
}

function createTitleTapParticles(p) {
  const palette = COLORS[p.color];
  for (let i = 0; i < 10; i += 1) {
    const angle = random(0, Math.PI * 2);
    const speed = random(36, 92);
    titleParticles.push({
      x: p.x + Math.cos(angle) * p.r * 0.45,
      y: p.y + Math.sin(angle) * p.r * 0.45,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - random(8, 28),
      radius: random(1.8, 4.2),
      alpha: 1,
      life: 0,
      color: i % 3 === 0 ? "#ffffff" : palette.fill
    });
  }
}

function startGameFromTitle() {
  if (!titleActive || titleStarting) return;
  audio.unlock();
  audio.playJingle("gameStart");
  audio.stopBgm(0.55);
  titleStarting = true;
  titleScreen.classList.add("starting");
  titleModal.classList.add("hidden");

  window.setTimeout(() => {
    init(false);
  }, 560);
}

function openTitleModal(kind) {
  audio.unlock();
  if (!audio.currentBgm || audio.currentBgm.key !== "title") {
    audio.playTitleBgm();
  }
  titleModal.classList.remove("hidden");

  if (kind === "settings") {
    titleModalTitle.textContent = "SETTINGS";
    titleModalBody.innerHTML = `
      <p>BGM Volume: Coming soon</p>
      <p>SE Volume: Coming soon</p>
      <p>Vibration: Coming soon</p>
    `;
  } else {
    titleModalTitle.textContent = "HOW TO PLAY";
    titleModalBody.innerHTML = `
      <p>1. 同じ色をつなぐ</p>
      <p>2. 長チェーンで高得点</p>
      <p>3. トゲぷにに注意</p>
      <p>4. スキルゲージをためる</p>
      <p>5. FEVERで大量得点</p>
    `;
  }
}

function closeTitleModal() {
  titleModal.classList.add("hidden");
}

function pointerMove(event) {
  if (selected.length === 0 || paused || gameOver || rewardChoosing || skillSelecting || skillCastDelay > 0) return;
  event.preventDefault();
  const previous = pointer || lastPointer;
  pointer = getPointerPosition(event);

  const lastSelected = selected[selected.length - 1];
  const tracedSpike = lineHitSpike(previous, pointer) || lineHitSpike(lastSelected, pointer);
  if (tracedSpike) {
    failChain(pointer, tracedSpike);
    return;
  }

  const hit = getSelectablePuni(pointer, previous);
  if (hit) {
    hit.press = 1;
    selected.push(hit);
    updateSelectedColorFromPuni(hit);
    audio.playChainStep(selected.length);
  }
  lastPointer = pointer;
}

function pointerUp() {
  if (selected.length >= 3) {
    removeSelected();
  }
  selected = [];
  selectedColor = null;
  pointer = null;
  lastPointer = null;
}

function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: point.clientX - rect.left,
    y: point.clientY - rect.top
  };
}

function getPuniAt(x, y) {
  for (let i = puni.length - 1; i >= 0; i -= 1) {
    const p = puni[i];
    if (p.removing) continue;
    if (distance(x, y, p.x, p.y) <= p.r + 10) {
      return p;
    }
  }
  return null;
}

function getSelectablePuni(current, previous) {
  const lastSelected = selected[selected.length - 1];
  if (!lastSelected) return null;

  let best = null;
  let bestDistance = Infinity;

  for (const p of puni) {
    if (p.removing || selected.includes(p) || !canJoinChain(p)) continue;

    const directDistance = distance(current.x, current.y, p.x, p.y);
    const pathDistance = previous ? distanceToSegment(p.x, p.y, previous.x, previous.y, current.x, current.y) : directDistance;
    const hitDistance = Math.min(directDistance, pathDistance);
    const blocked = isPathBlocked(lastSelected, p);

    if (!blocked && hitDistance <= p.r + 18 && hitDistance < bestDistance) {
      best = p;
      bestDistance = hitDistance;
    }
  }

  return best;
}

function isPathBlocked(from, to) {
  for (const spike of spikes) {
    if (distanceToSegment(spike.x, spike.y, from.x, from.y, to.x, to.y) <= spike.r + 3) {
      return true;
    }
  }

  for (const blocker of puni) {
    if (blocker === from || blocker === to || selected.includes(blocker) || blocker.removing) continue;
    if (isWildcardPuni(blocker) || selectedColor === null || getEffectivePuniColor(blocker) === selectedColor) continue;
    if (distanceToSegment(blocker.x, blocker.y, from.x, from.y, to.x, to.y) <= blocker.r + 4) {
      return true;
    }
  }

  return false;
}

function isWildcardPuni(p) {
  return p.variant === "rainbow" || p.variant === "golden";
}

function canJoinChain(p) {
  return isWildcardPuni(p) || selectedColor === null || getEffectivePuniColor(p) === selectedColor;
}

function updateSelectedColorFromPuni(p) {
  if (!isWildcardPuni(p)) {
    selectedColor = getEffectivePuniColor(p);
  }
}

function lineHitSpike(from, to) {
  if (!from || !to) return null;
  return spikes.find((spike) => distanceToSegment(spike.x, spike.y, from.x, from.y, to.x, to.y) <= spike.r + 5) || null;
}

function selectedTouchesSpike() {
  for (const p of selected) {
    const pRadius = p.r * (p === selected[0] ? getParentScale() : 1.08);
    const spike = spikes.find((item) => distance(p.x, p.y, item.x, item.y) <= pRadius + item.r);
    if (spike) return spike;
  }

  return null;
}

function failChain(point = pointer, hitSpike = null) {
  const last = selected[selected.length - 1];
  const origin = point || (last ? { x: last.x, y: last.y } : { x: playWidth * 0.5, y: playHeight * 0.5 });

  if (hitSpike) {
    hitSpike.hitFlash = 1;
    audio.playSe("spikeHit");
    burstEffects.push({
      x: hitSpike.x,
      y: hitSpike.y,
      radius: hitSpike.r + 6,
      alpha: 1,
      life: 0,
      color: "spike"
    });
  }

  burstEffects.push({
    x: origin.x,
    y: origin.y,
    radius: 10,
    alpha: 1,
    life: 0,
    color: "chain"
  });

  createPopParticles();
  selected = [];
  selectedColor = null;
  pointer = null;
  lastPointer = null;
}

function removeSelected() {
  const count = selected.length;
  const hadGolden = selected.some((p) => p.variant === "golden");
  const gainedScore = calculateScore(count);
  const popupPoint = getSelectedCenter();

  for (const p of selected) {
    p.removing = true;
    p.vx = 0;
    p.vy = 0;
  }

  addScore(gainedScore);
  addFeverGauge(count);
  addSkillGauge(count);
  audio.playChainPop(count);
  if (hadGolden) audio.playSe("goldenGet");
  createScorePopup(gainedScore, popupPoint);
  createChainNotice(count);
  removedTotal += count;
  checkMissionReward();
  updateHud();
  checkStageClear();
}

function calculateScore(count) {
  const baseScore = count * 100;
  let chainBonus = 0;
  if (count >= 10) chainBonus += 1500;
  if (count >= 7) chainBonus += 1000;
  else if (count >= 5) chainBonus += 500;

  const chainBonusMultiplier = 1 + Math.min(GAME_CONFIG.upgrades.chainBonusMaxLevel, playerUpgrades.chainBonusLevel) * GAME_CONFIG.upgrades.chainBonusPerLevel;
  const goldenBonus = selected.filter((p) => p.variant === "golden").length * GAME_CONFIG.specialPuni.golden.scoreBonus;

  const subtotal = baseScore + Math.round(chainBonus * chainBonusMultiplier) + goldenBonus;
  const feverMultiplier = feverActive ? GAME_CONFIG.fever.scoreMultiplier : 1;
  return Math.round(subtotal * feverMultiplier);
}

function addScore(gainedScore) {
  score += gainedScore;
}

function addFeverGauge(count) {
  if (feverActive) return;

  const baseGain = getFeverGain(count);
  if (baseGain <= 0) return;

  const boostMultiplier = 1 + Math.min(GAME_CONFIG.upgrades.feverBoostMaxLevel, playerUpgrades.feverBoostLevel) * GAME_CONFIG.fever.boostPerLevel;
  feverGauge = Math.min(100, feverGauge + Math.round(baseGain * boostMultiplier));

  if (feverGauge >= 100) {
    startFever();
  } else {
    updateFeverUI();
  }
}

function getFeverGain(count) {
  const gain = GAME_CONFIG.fever.gainByChain;
  if (count >= 10) return gain.huge;
  if (count >= 7) return gain.large;
  if (count >= 5) return gain.medium;
  if (count >= 3) return gain.small;
  return 0;
}

function startFever() {
  feverActive = true;
  feverTimer = GAME_CONFIG.fever.duration;
  feverGauge = 100;
  feverNoticeTimer = 1.4;
  screenFlash = Math.max(screenFlash, 1.2);
  audio.playFeverStartSequence();
  audio.playFeverBgm();
  chainNotices.push({
    x: playWidth * 0.5,
    y: 112,
    text: "FEVER!",
    color: "#d58bdd",
    size: 32,
    alpha: 1,
    life: 0
  });
  updateFeverUI();
}

function updateFever(dt) {
  if (feverNoticeTimer > 0) {
    feverNoticeTimer = Math.max(0, feverNoticeTimer - dt);
  }

  if (!feverActive) return;

  feverTimer = Math.max(0, feverTimer - dt);
  if (feverTimer <= 0) {
    endFever();
    return;
  }

  updateFeverUI();
}

function endFever() {
  feverActive = false;
  feverTimer = 0;
  feverGauge = 0;
  feverNoticeTimer = 0;
  audio.playFeverEndSequence();
  if (timeupBgmActive || timeLeft <= 5) {
    timeupBgmActive = timeLeft > 0;
    if (timeupBgmActive) audio.playTimeupBgm();
  } else {
    audio.resumeStageBgm();
  }
  updateFeverUI();
}

function updateHud() {
  updateHUD();
  updateMissionUI();
  updateStageUI();
  updateFeverUI();
  updateSkillUI();
}

function updateHUD() {
  timeText.textContent = Math.ceil(timeLeft).toString();
  stageText.textContent = currentStage.toString();
  scoreText.textContent = formatNumber(score);
}

function updateMissionUI() {
  missionText.textContent = `${Math.min(removedTotal, GAME_CONFIG.missionTarget)} / ${GAME_CONFIG.missionTarget}`;
  missionFill.style.width = `${Math.min(100, (removedTotal / GAME_CONFIG.missionTarget) * 100)}%`;
}

function updateStageUI() {
  const target = getStageScoreTarget(currentStage);
  const progress = getStageProgressRatio();
  const percent = Math.floor(progress * 100);
  const theme = getCurrentTheme();

  targetText.textContent = `TARGET ${formatNumber(target)}`;
  targetPercentText.textContent = `${percent}%`;
  themeText.textContent = `${theme.name} / ${theme.gimmick.toUpperCase()}`;
  stageProgressFill.style.width = `${percent}%`;
  stageGoalCard.classList.toggle("near-clear", progress >= 0.8 && progress < 1);
}

function updateFeverUI() {
  const displayValue = feverActive ? Math.ceil(Math.max(0, feverTimer)) : Math.floor(feverGauge);
  feverText.textContent = feverActive ? `${displayValue}s` : `${displayValue}%`;
  feverFill.style.width = `${feverActive ? Math.max(0, (feverTimer / GAME_CONFIG.fever.duration) * 100) : Math.min(100, feverGauge)}%`;
  feverCard.classList.toggle("active", feverActive);
  gameCard.classList.toggle("fever-active", feverActive);
}

function addSkillGauge(count) {
  if (!selectedSkillId || skillLevel >= GAME_CONFIG.skill.maxLevel) return;

  const gain = getSkillGain(count);
  if (gain <= 0) return;

  const previousLevel = skillLevel;
  const total = skillLevel * 100 + skillGauge + gain;
  skillLevel = Math.min(GAME_CONFIG.skill.maxLevel, Math.floor(total / 100));
  skillGauge = skillLevel >= GAME_CONFIG.skill.maxLevel ? 100 : total % 100;
  if (skillLevel > previousLevel) {
    audio.playSe("skillReady");
  }
  updateSkillUI();
}

function getSkillGain(count) {
  const gain = GAME_CONFIG.skill.gainByChain;
  if (count >= 10) return gain.huge;
  if (count >= 7) return gain.large;
  if (count >= 5) return gain.medium;
  if (count >= 3) return gain.small;
  return 0;
}

function updateSkillUI() {
  const skill = getSelectedSkill();
  skillNameText.textContent = skill ? skill.name : "NO SKILL";
  skillLevelText.textContent = `Lv${skillLevel}${skillLevel >= GAME_CONFIG.skill.maxLevel ? " MAX" : ""}`;
  skillFill.style.width = `${Math.min(100, skillGauge)}%`;
  skillButton.disabled = !skill || skillLevel <= 0 || paused || gameOver || skillSelecting || rewardChoosing || skillCastDelay > 0;
  skillButton.textContent = skillLevel > 0 ? "SKILL!" : "SKILL";
}

function getSelectedSkill() {
  return SKILLS.find((skill) => skill.id === selectedSkillId) || null;
}

function updateSkillTimers(dt) {
  if (skillFreezeTimer > 0) {
    skillFreezeTimer = Math.max(0, skillFreezeTimer - dt);
  }

  if (colorShiftTimer > 0) {
    colorShiftTimer = Math.max(0, colorShiftTimer - dt);
  }

  screenShake = Math.max(0, screenShake - dt * 3.5);
}

function updateSkillCastDelay(dt) {
  skillCastDelay = Math.max(0, skillCastDelay - dt);
  screenShake = Math.max(screenShake, 0.35);
  if (skillCastDelay === 0 && pendingSkill) {
    executeSkill(pendingSkill.id, pendingSkill.level, pendingSkill.targetColor);
    pendingSkill = null;
  }
}

function updateSkillEffect(dt) {
  screenShake = Math.max(0, screenShake - dt * 3.5);
  if (skillEffectTimer <= 0) return;
  skillEffectTimer = Math.max(0, skillEffectTimer - dt);
  if (skillEffectTimer === 0) {
    skillEffect = null;
  }
}

function castSkill() {
  const skill = getSelectedSkill();
  if (!skill || skillLevel <= 0 || paused || gameOver || skillSelecting || rewardChoosing || stageTransitionTimer > 0 || skillCastDelay > 0) return;

  audio.unlock();
  if (skill.id === "allClear") {
    audio.playAllClearSequence();
  } else {
    audio.playSkill(skill.id);
  }
  pendingSkill = {
    id: skill.id,
    level: skillLevel,
    targetColor: selectedColor ?? getMostCommonPuniColor()
  };
  skillGauge = 0;
  skillLevel = 0;
  skillCastDelay = 0.25;
  selected = [];
  selectedColor = null;
  pointer = null;
  lastPointer = null;
  startSkillEffect(skill.id, "charge");
  screenFlash = Math.max(screenFlash, 2.2);
  screenShake = 1;
  updateSkillUI();
}

function executeSkill(skillId, level, targetColor) {
  startSkillEffect(skillId, "burst");

  if (skillId === "colorBurst") {
    activateColorBurst(level, targetColor);
  } else if (skillId === "freeze") {
    activateFreeze(level);
  } else if (skillId === "colorShift") {
    activateColorShift(level, targetColor);
  } else if (skillId === "allClear") {
    activateAllClear(level);
  }

  updateHud();
  checkStageClear();
}

function activateColorBurst(level, targetColor) {
  const targets = puni.filter((p) => !p.removing && (p.variant === "rainbow" || (p.variant === "normal" && getEffectivePuniColor(p) === targetColor)));
  removeSkillTargets(targets, 140, "COLOR BURST!");
}

function activateFreeze(level) {
  skillFreezeTimer = GAME_CONFIG.skill.freezeSecondsByLevel[level] || 3;
}

function activateColorShift(level, targetColor) {
  colorShiftColor = targetColor;
  colorShiftTimer = GAME_CONFIG.skill.colorShiftSecondsByLevel[level] || 2;
}

function activateAllClear(level) {
  const eligible = puni.filter((p) => !p.removing);
  const ratio = GAME_CONFIG.skill.allClearRatiosByLevel[level] || 0.5;
  const count = Math.ceil(eligible.length * ratio);
  const targets = shuffleArray(eligible).slice(0, count);
  removeSkillTargets(targets, 180, "ALL CLEAR!!");
}

function removeSkillTargets(targets, scorePerPuni, label) {
  if (targets.length === 0) return;

  const point = getCenterOfPieces(targets);
  const hadGolden = targets.some((p) => p.variant === "golden");
  for (const p of targets) {
    p.removing = true;
    p.vx = random(-80, 80);
    p.vy = random(-80, 80);
  }

  const multiplier = (feverActive ? GAME_CONFIG.fever.scoreMultiplier : 1) * GAME_CONFIG.skill.scoreMultiplier;
  const gainedScore = Math.round(targets.length * scorePerPuni * multiplier);
  addScore(gainedScore);
  removedTotal += targets.length;
  if (label !== "ALL CLEAR!!") {
    audio.playChainPop(Math.min(12, targets.length));
  }
  if (hadGolden) audio.playSe("goldenGet");
  createScorePopup(gainedScore, point);
  createSkillParticles(targets, label === "ALL CLEAR!!" ? 13 : 8);
  chainNotices.push({
    x: playWidth * 0.5,
    y: label === "ALL CLEAR!!" ? 120 : 86,
    text: label,
    color: label === "ALL CLEAR!!" ? "#f0a048" : "#d58bdd",
    size: label === "ALL CLEAR!!" ? 34 : 29,
    alpha: 1,
    life: 0
  });
  checkMissionReward();
}

function getMostCommonPuniColor() {
  const counts = Array(COLORS.length).fill(0);
  for (const p of puni) {
    if (!p.removing && p.variant === "normal") counts[getEffectivePuniColor(p)] += 1;
  }
  return counts.indexOf(Math.max(...counts));
}

function getCenterOfPieces(pieces) {
  const total = pieces.reduce((sum, p) => {
    sum.x += p.x;
    sum.y += p.y;
    return sum;
  }, { x: 0, y: 0 });
  return {
    x: total.x / pieces.length,
    y: total.y / pieces.length
  };
}

function createSkillParticles(targets, countPerTarget) {
  for (const p of targets) {
    const palette = getPuniPalette(p);
    for (let i = 0; i < countPerTarget; i += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(80, 190);
      popParticles.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: random(3, 7),
        alpha: 1,
        life: 0,
        color: i % 4 === 0 ? "#ffffff" : palette.fill
      });
    }
  }
}

function startSkillEffect(skillId, phase) {
  const style = getSkillStyle(skillId);
  skillEffect = {
    ...style,
    phase,
    life: 0,
    duration: phase === "charge" ? 0.35 : 1.05
  };
  skillEffectTimer = skillEffect.duration;
  screenFlash = Math.max(screenFlash, phase === "charge" ? 1.7 : 2.5);
  screenShake = Math.max(screenShake, phase === "charge" ? 0.8 : 1.25);
}

function getSkillStyle(skillId) {
  if (skillId === "freeze") {
    return { text: "FREEZE!!", color: "#85d9ff", glow: "rgba(212, 246, 255, 0.88)" };
  }
  if (skillId === "colorShift") {
    return { text: "COLOR SHIFT!!", color: "#d58bdd", glow: "rgba(255, 210, 245, 0.82)" };
  }
  if (skillId === "allClear") {
    return { text: "ALL CLEAR!!", color: "#f0a048", glow: "rgba(255, 238, 170, 0.9)" };
  }
  return { text: "COLOR BURST!", color: "#ff7da3", glow: "rgba(255, 198, 218, 0.86)" };
}

function shuffleArray(items) {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function updateBurstEffects(dt) {
  for (const effect of burstEffects) {
    effect.life += dt;
    effect.radius += dt * 90;
    effect.alpha = Math.max(0, 1 - effect.life * 3.4);
  }

  burstEffects = burstEffects.filter((effect) => effect.alpha > 0.02);
}

function updatePopParticles(dt) {
  for (const particle of popParticles) {
    particle.life += dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += dt * 48;
    particle.alpha = Math.max(0, 1 - particle.life * 3.8);
    particle.radius = Math.max(0, particle.radius - dt * 3.2);
  }

  popParticles = popParticles.filter((particle) => particle.alpha > 0.02 && particle.radius > 0.3);
}

function updateScorePopups(dt) {
  for (const popup of scorePopups) {
    popup.life += dt;
    popup.y -= dt * (popup.fever ? 44 : 34);
    popup.alpha = Math.max(0, 1 - popup.life * (popup.fever ? 1.45 : 1.8));
  }

  scorePopups = scorePopups.filter((popup) => popup.alpha > 0.02);
}

function updateChainNotices(dt) {
  for (const notice of chainNotices) {
    notice.life += dt;
    notice.y -= dt * 18;
    notice.alpha = Math.max(0, 1 - Math.max(0, notice.life - 0.18) * 1.9);
  }

  chainNotices = chainNotices.filter((notice) => notice.alpha > 0.02);
}

function updateScreenFlash(dt) {
  screenFlash = Math.max(0, screenFlash - dt * 1.9);
}

function updateStageTransition(dt) {
  stageTransitionTimer = Math.max(0, stageTransitionTimer - dt);
  if (stageTransitionTimer === 0) {
    stageBanner = null;
    if (gameState === GAME_STATE.READY) {
      setGameState(GAME_STATE.PLAYING);
    }
  }
}

function updateMissionNotice(dt) {
  if (missionNoticeTimer <= 0) return;

  missionNoticeTimer = Math.max(0, missionNoticeTimer - dt);
  if (missionNoticeTimer === 0) {
    missionNotice.classList.remove("show");
  }
}

function checkMissionReward() {
  if (missionCleared || removedTotal < GAME_CONFIG.missionTarget) return;

  missionCleared = true;
  timeLeft += GAME_CONFIG.missionRewardSeconds;
  missionNoticeTimer = 1.7;
  missionNotice.textContent = `CLEAR +${GAME_CONFIG.missionRewardSeconds}s`;
  missionNotice.classList.add("show");
}

function updateGameOverUI(title) {
  const recordState = updateHighScore();

  setGameState(GAME_STATE.GAME_OVER);
  timeupBgmActive = false;
  if (title === "GAME OVER") {
    audio.playGameOver();
  } else {
    audio.playStageClear();
  }
  if (recordState.isNewRecord) {
    audio.playJingle("newRecord");
  }
  rewardChoosing = false;
  hideOverlayPanels();
  resultPanel.classList.remove("hidden");
  overlayTitle.textContent = title;
  finalStageText.textContent = currentStage.toString();
  bestScoreText.textContent = formatNumber(recordState.highScore);
  bestStageText.textContent = recordState.highStage.toString();
  recordText.textContent = recordState.isNewRecord ? "NEW RECORD!" : "";
  recordText.classList.toggle("show", recordState.isNewRecord);

  resultScoreDisplay = 0;
  resultScoreTarget = score;
  resultAnimating = true;
  finalScoreText.textContent = "0";
  overlay.classList.remove("pause-overlay");
  overlay.classList.remove("hidden");
}

function updateGameOverAnimation(dt) {
  if (!resultAnimating) return;

  const step = Math.max(600, resultScoreTarget * 1.8) * dt;
  resultScoreDisplay = Math.min(resultScoreTarget, resultScoreDisplay + step);
  finalScoreText.textContent = formatNumber(Math.floor(resultScoreDisplay));

  if (resultScoreDisplay >= resultScoreTarget) {
    resultAnimating = false;
    finalScoreText.textContent = formatNumber(resultScoreTarget);
  }
}

function updateHighScore() {
  const currentData = loadHighScore();
  const nextData = {
    highScore: Math.max(currentData.highScore, score),
    highStage: Math.max(currentData.highStage, currentStage)
  };
  const isNewRecord = score > currentData.highScore || currentStage > currentData.highStage;

  if (isNewRecord) {
    saveHighScore(nextData);
  }

  highScoreData = isNewRecord ? nextData : currentData;
  return {
    ...highScoreData,
    isNewRecord
  };
}

function loadHighScore() {
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (!saved) return { highScore: 0, highStage: 1 };

    const parsed = JSON.parse(saved);
    return {
      highScore: Number(parsed.highScore) || 0,
      highStage: Math.max(1, Number(parsed.highStage) || 1)
    };
  } catch (error) {
    return { highScore: 0, highStage: 1 };
  }
}

function saveHighScore(data) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify({
      highScore: data.highScore,
      highStage: data.highStage
    }));
  } catch (error) {
    // Saving best results is nice-to-have; gameplay should continue if storage is unavailable.
  }
}

function checkStageClear() {
  if (stageTransitionTimer > 0 || rewardChoosing || gameOver) return;
  if (score < getStageScoreTarget(currentStage)) return;

  if (currentStage >= GAME_CONFIG.maxStage) {
    showAllClear();
    return;
  }

  showRewardPresent(currentStage + 1);
}

function startStageTransition(nextStage) {
  setGameState(GAME_STATE.READY);
  const extraSeconds = Math.min(5, playerUpgrades.nextStageExtraSeconds);
  currentStage = nextStage;
  timeLeft = GAME_CONFIG.baseSeconds + extraSeconds;
  lastCountdownSecond = null;
  timeupBgmActive = false;
  playerUpgrades.nextStageExtraSeconds = 0;
  stageGimmickTime = 0;
  clearActiveInput();
  applyThemeToUI();
  stageTransitionTimer = 1.15;
  const theme = getCurrentTheme();
  stageBanner = {
    title: `STAGE ${currentStage}`,
    subtitle: theme.name,
    duration: stageTransitionTimer
  };
  screenFlash = 1.6;
  audio.playJingle("stageUp");
  audio.playStageBgm(currentStage);
  audio.playJingle("stageStart");

  refreshBoardForStage();
  adjustSpikeCountForStage();
  ensurePlayableBoard(true);
  burstPiecesOutward();
  updateHud();
}

function showRewardPresent(nextStage) {
  setGameState(GAME_STATE.REWARD);
  rewardNextStage = nextStage;
  const reward = getRandomReward();
  rewardChoices = [reward];
  resetStageRewards();
  applyReward(reward.id);
  clearActiveInput();
  rewardPresentTimer = 2.4;
  screenFlash = 1.3;
  timeupBgmActive = false;
  audio.playStageClear();
  audio.playJingle("stageClear");
  stageBanner = null;
  stageTransitionTimer = 0;

  hideOverlayPanels();
  rewardPanel.classList.remove("hidden");
  overlay.classList.remove("pause-overlay");
  overlay.classList.remove("hidden");
  rewardSubtitle.textContent = "PRESENT";
  rewardOptions.innerHTML = "";

  const card = document.createElement("div");
  card.className = "reward-card present-card";
  card.innerHTML = `<span>Gift for next stage</span><strong>${reward.title}</strong><span>${reward.description}</span>`;
  rewardOptions.appendChild(card);
}

function updateRewardPresent(dt) {
  if (!rewardChoosing) return;

  rewardPresentTimer = Math.max(0, rewardPresentTimer - dt);
  if (rewardPresentTimer > 0) return;

  rewardChoosing = false;
  rewardChoices = [];
  overlay.classList.add("hidden");
  rewardPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  rewardOptions.innerHTML = "";
  startStageTransition(rewardNextStage);
  rewardNextStage = 0;
}

function getRandomReward() {
  return REWARDS[Math.floor(Math.random() * REWARDS.length)];
}

function resetStageRewards() {
  playerUpgrades = createDefaultUpgrades();
}

function showSkillSelect() {
  setGameState(GAME_STATE.SKILL_SELECT);
  if (audio.context) {
    audio.playTitleBgm();
  }
  hideOverlayPanels();
  skillSelectPanel.classList.remove("hidden");
  overlay.classList.remove("pause-overlay");
  overlay.classList.remove("hidden");
  skillOptions.innerHTML = "";

  for (const skill of SKILLS) {
    const button = document.createElement("button");
    button.className = "reward-card";
    button.type = "button";
    button.innerHTML = `<strong>${skill.name}</strong><span>${skill.description}</span>`;
    button.addEventListener("click", () => selectSkill(skill.id));
    skillOptions.appendChild(button);
  }
}

function selectSkill(skillId) {
  audio.unlock();
  selectedSkillId = skillId;
  setGameState(GAME_STATE.READY);
  overlay.classList.add("hidden");
  skillSelectPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  skillOptions.innerHTML = "";
  lastTime = performance.now();
  timeupBgmActive = false;
  audio.playStageBgm(currentStage);
  audio.playJingle("stageStart");
  stageTransitionTimer = 0.8;
  stageBanner = {
    title: "READY?",
    subtitle: `STAGE ${currentStage}`,
    duration: stageTransitionTimer
  };
  screenFlash = 0.8;
  updateSkillUI();
}

function applyReward(rewardId) {
  if (rewardId === "time") {
    playerUpgrades.nextStageExtraSeconds = GAME_CONFIG.upgrades.nextStageExtraSeconds;
  } else if (rewardId === "chain") {
    playerUpgrades.chainBonusLevel = Math.min(GAME_CONFIG.upgrades.chainBonusMaxLevel, playerUpgrades.chainBonusLevel + 1);
  } else if (rewardId === "fever") {
    playerUpgrades.feverBoostLevel = Math.min(GAME_CONFIG.upgrades.feverBoostMaxLevel, playerUpgrades.feverBoostLevel + 1);
  } else if (rewardId === "rainbow") {
    playerUpgrades.rainbowLevel = Math.min(GAME_CONFIG.upgrades.rainbowMaxLevel, playerUpgrades.rainbowLevel + 1);
  } else if (rewardId === "golden") {
    playerUpgrades.goldenLevel = Math.min(GAME_CONFIG.upgrades.goldenMaxLevel, playerUpgrades.goldenLevel + 1);
  }
}

function refreshBoardForStage() {
  const refreshCount = Math.min(18, Math.floor(puni.length * 0.35));
  for (let i = 0; i < refreshCount; i += 1) {
    const index = Math.floor(Math.random() * puni.length);
    puni.splice(index, 1);
  }

  while (puni.length < GAME_CONFIG.targetCount) {
    puni.push(createPuni());
  }
}

function adjustSpikeCountForStage() {
  const targetSpikes = getSpikeCountForStage(currentStage);
  while (spikes.length < targetSpikes) {
    spikes.push(createSpike());
  }
  while (spikes.length > targetSpikes) {
    spikes.pop();
  }
}

function burstPiecesOutward() {
  const centerX = playWidth * 0.5;
  const centerY = playHeight * 0.48;
  const force = 42 + currentStage * 4;

  for (const piece of getAllPieces()) {
    const dx = piece.x - centerX;
    const dy = piece.y - centerY;
    const length = Math.max(1, Math.hypot(dx, dy));
    piece.vx += (dx / length) * force;
    piece.vy += (dy / length) * force;
  }
}

function showAllClear() {
  setGameState(GAME_STATE.GAME_OVER);
  clearActiveInput();
  screenFlash = 1.8;
  audio.playJingle("allClear");
  updateGameOverUI("ALL CLEAR!");
}

function createScorePopup(gainedScore, point) {
  scorePopups.push({
    x: point.x,
    y: point.y,
    text: `+${gainedScore}`,
    fever: feverActive,
    alpha: 1,
    life: 0
  });
}

function createChainNotice(count) {
  const notice = getChainNotice(count);
  if (!notice) return;

  chainNotices.push({
    x: playWidth * 0.5,
    y: 58,
    text: notice.text,
    color: notice.color,
    size: notice.size,
    alpha: 1,
    life: 0
  });

  if (count >= 10) {
    screenFlash = 1;
  }
}

function getChainNotice(count) {
  if (count >= 10) {
    return { text: "EXCELLENT!", color: "#d58bdd", size: 30 };
  }
  if (count >= 7) {
    return { text: "GREAT!", color: "#8abedb", size: 27 };
  }
  if (count >= 5) {
    return { text: "GOOD!", color: "#8acfbf", size: 24 };
  }
  return null;
}

function getCurrentTheme(stage = currentStage) {
  return STAGE_THEMES.find((theme) => theme.stage === stage) || STAGE_THEMES[STAGE_THEMES.length - 1];
}

function getCurrentGimmick(stage = currentStage) {
  return getCurrentTheme(stage).gimmick;
}

function applyThemeToUI() {
  const colors = getCurrentTheme().colors;
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty("--theme-bg-a", colors.backgroundA);
  rootStyle.setProperty("--theme-bg-b", colors.backgroundB);
  rootStyle.setProperty("--theme-bg-c", colors.backgroundC);
  rootStyle.setProperty("--theme-card-a", colors.cardA);
  rootStyle.setProperty("--theme-card-b", colors.cardB);
  rootStyle.setProperty("--theme-card-c", colors.cardC);
  rootStyle.setProperty("--theme-accent", colors.accent);
  rootStyle.setProperty("--theme-accent-soft", colors.accentSoft);
}

function getStageScoreTarget(stage = currentStage) {
  return Math.round(GAME_CONFIG.stageScoreBase * Math.pow(stage, GAME_CONFIG.stageTargetExponent));
}

function getStageProgressRatio(stage = currentStage) {
  const previousTarget = stage <= 1 ? 0 : getStageScoreTarget(stage - 1);
  const currentTarget = getStageScoreTarget(stage);
  const range = currentTarget - previousTarget;
  return Math.max(0, Math.min(1, (score - previousTarget) / range));
}

function getSpikeCountForStage(stage = currentStage) {
  const matchedRule = GAME_CONFIG.stageDifficulty.spikeCountByStage.find((rule) => stage >= rule.fromStage);
  if (matchedRule) return matchedRule.count;
  return GAME_CONFIG.spikeCount;
}

function getStageSpeedMultiplier(stage = currentStage) {
  return 1 + (stage - 1) * GAME_CONFIG.stageDifficulty.speedIncreasePerStage;
}

function createPopParticles() {
  for (const p of selected) {
    const palette = getPuniPalette(p);
    const particleCount = feverActive ? 11 : 7;
    for (let i = 0; i < particleCount; i += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = feverActive ? random(58, 125) : random(38, 95);
      popParticles.push({
        x: p.x + Math.cos(angle) * p.r * 0.35,
        y: p.y + Math.sin(angle) * p.r * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: feverActive ? random(2.5, 5.4) : random(2.2, 4.2),
        alpha: 1,
        life: 0,
        color: feverActive && i % 4 === 0 ? "#ffd986" : (i % 3 === 0 ? "#ffffff" : palette.fill)
      });
    }
  }
}

function drawParentRing(radius, palette) {
  const count = selected.length;
  const pulse = count >= 7 ? 1 + Math.sin(performance.now() * 0.008) * 0.12 : 1;
  const ringRadius = radius + (count >= 5 ? 12 : 8) * pulse;

  ctx.save();
  ctx.globalAlpha = count >= 7 ? 0.48 : 0.36;
  ctx.strokeStyle = palette.fill;
  ctx.lineWidth = count >= 5 ? 4 : 3;
  ctx.beginPath();
  ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = count >= 5 ? 0.2 : 0.12;
  ctx.fillStyle = palette.fill;
  ctx.beginPath();
  ctx.arc(0, 0, ringRadius + 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function getParentScale() {
  const count = selected.length;
  if (count >= 7) return 1.55;
  if (count >= 5) return 1.35;
  if (count >= 3) return 1.15;
  return 1;
}

function getChainStyle() {
  const count = selected.length;
  if (count >= 7) {
    return { width: 13, glow: 13, useColorGlow: true, useColorLine: true };
  }
  if (count >= 5) {
    return { width: 12, glow: 10, useColorGlow: true, useColorLine: true };
  }
  if (count >= 3) {
    return { width: 10, glow: 8, useColorGlow: false, useColorLine: false };
  }
  return { width: 8, glow: 0, useColorGlow: false, useColorLine: false };
}

function getSelectedChainColor() {
  const palette = COLORS[selectedColor] || COLORS[0];
  return {
    line: withAlpha(palette.fill, 0.88),
    glow: withAlpha(palette.fill, 0.42)
  };
}

function getSpikeWarningLevel(spike) {
  if (selected.length === 0 || !pointer) return 0;

  let nearest = distance(pointer.x, pointer.y, spike.x, spike.y);

  for (let i = 1; i < selected.length; i += 1) {
    nearest = Math.min(
      nearest,
      distanceToSegment(spike.x, spike.y, selected[i - 1].x, selected[i - 1].y, selected[i].x, selected[i].y)
    );
  }

  const last = selected[selected.length - 1];
  if (last) {
    nearest = Math.min(nearest, distanceToSegment(spike.x, spike.y, last.x, last.y, pointer.x, pointer.y));
  }

  const warningDistance = spike.r + 46;
  if (nearest >= warningDistance) return 0;
  return Math.min(1, (warningDistance - nearest) / 30);
}

function getSelectedCenter() {
  if (selected.length === 0) {
    return { x: playWidth * 0.5, y: playHeight * 0.5 };
  }

  const total = selected.reduce((sum, p) => {
    sum.x += p.x;
    sum.y += p.y;
    return sum;
  }, { x: 0, y: 0 });

  return {
    x: total.x / selected.length,
    y: total.y / selected.length
  };
}

function togglePause() {
  if (gameState === GAME_STATE.PAUSED || gameState === GAME_STATE.EXIT_CONFIRM) {
    resumeGame();
    return;
  }
  if (!isPauseAllowed() || skillCastDelay > 0) return;
  showPause();
}

function showPause() {
  prePauseState = gameState === GAME_STATE.READY ? GAME_STATE.READY : GAME_STATE.PLAYING;
  setGameState(GAME_STATE.PAUSED);
  clearActiveInput();
  audio.unlock();
  audio.playSe("chainStart", { frequency: 330, volume: 0.16 });
  audio.playTitleBgm(0.45);
  hideOverlayPanels();
  pausePanel.classList.remove("hidden");
  overlay.classList.add("pause-overlay");
  overlay.classList.remove("hidden");
}

function resumeGame() {
  if (gameState !== GAME_STATE.PAUSED && gameState !== GAME_STATE.EXIT_CONFIRM) return;
  const nextState = prePauseState === GAME_STATE.READY ? GAME_STATE.READY : GAME_STATE.PLAYING;
  setGameState(nextState);
  audio.unlock();
  audio.playSe("chainStep", { frequency: 440, volume: 0.16 });
  if (timeupBgmActive || timeLeft <= 5) {
    timeupBgmActive = timeLeft > 0;
    if (timeupBgmActive) audio.playTimeupBgm(0.45);
  } else if (feverActive) {
    audio.playFeverBgm(0.45);
  } else {
    audio.resumeStageBgm(0.45);
  }
  hideOverlayPanels();
  overlay.classList.remove("pause-overlay");
  overlay.classList.add("hidden");
  lastTime = performance.now();
}

function showExitConfirm() {
  if (gameState !== GAME_STATE.PAUSED) return;
  setGameState(GAME_STATE.EXIT_CONFIRM);
  audio.playSe("chainStart", { frequency: 260, volume: 0.14 });
  hideOverlayPanels();
  confirmExitPanel.classList.remove("hidden");
  overlay.classList.add("pause-overlay");
  overlay.classList.remove("hidden");
}

function cancelExitConfirm() {
  if (gameState !== GAME_STATE.EXIT_CONFIRM) return;
  setGameState(GAME_STATE.PAUSED);
  audio.playSe("chainStep", { frequency: 360, volume: 0.14 });
  hideOverlayPanels();
  pausePanel.classList.remove("hidden");
  overlay.classList.add("pause-overlay");
  overlay.classList.remove("hidden");
}

function returnToTitle() {
  if (gameState !== GAME_STATE.PAUSED && gameState !== GAME_STATE.EXIT_CONFIRM) return;
  audio.unlock();
  audio.playSe("chainStep", { frequency: 300, volume: 0.16 });
  audio.returnToTitleAudio();
  init(true);
}

function endGame() {
  setGameState(GAME_STATE.GAME_OVER);
  clearActiveInput();
  audio.playJingle("gameOver");
  updateGameOverUI("GAME OVER");
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function withAlpha(hexColor, alpha) {
  const normalized = hexColor.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function formatNumber(value) {
  return Math.round(value).toLocaleString("en-US");
}

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(px, py, ax, ay);

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return distance(px, py, ax + dx * t, ay + dy * t);
}

function getAllPieces() {
  return puni.concat(spikes);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  resizeTitleCanvas();
  if (titleActive) {
    createTitlePuni();
  }
});
titleCanvas.addEventListener("pointerdown", handleTitlePointerDown);
titleCanvas.addEventListener("mousedown", handleTitlePointerDown);
canvas.addEventListener("pointerdown", pointerDown);
canvas.addEventListener("pointermove", pointerMove);
canvas.addEventListener("pointerup", pointerUp);
canvas.addEventListener("pointercancel", pointerUp);
canvas.addEventListener("mousedown", pointerDown);
canvas.addEventListener("mousemove", pointerMove);
window.addEventListener("mouseup", pointerUp);
pauseButton.addEventListener("click", togglePause);
skillButton.addEventListener("click", castSkill);
playButton.addEventListener("click", startGameFromTitle);
resumeButton.addEventListener("click", resumeGame);
titleExitButton.addEventListener("click", showExitConfirm);
confirmExitYesButton.addEventListener("click", returnToTitle);
confirmExitNoButton.addEventListener("click", cancelExitConfirm);
settingsButton.addEventListener("click", () => openTitleModal("settings"));
howToButton.addEventListener("click", () => openTitleModal("howto"));
titleModalClose.addEventListener("click", closeTitleModal);
retryButton.addEventListener("click", () => init(true));

init();
