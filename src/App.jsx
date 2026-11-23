import { useCallback, useEffect, useRef, useState } from 'react'
import saree from './assets/tiya-saree.jpg'
import snow from './assets/tiya-snow.jpg'
import portrait from './assets/tiya-portrait.jpg'
import mirror from './assets/tiya-mirror.jpg'
import { PERSON, BALLOONS, PHOTO_CAPTIONS, LETTER } from './content.js'

const PHOTOS = [saree, snow, portrait, mirror]
const CHAPTERS = [
  ['intro', 'The beginning'],
  ['garden', 'A little magic'],
  ['cake', 'Make a wish'],
  ['balloons', 'Five little wishes'],
  ['gallery', 'Moments in time'],
  ['letter', 'A letter for you'],
  ['final', 'The best part'],
]

// Fixed positions keep the starfield consistent when moving between scenes.
let rngSeed = 397
const random = () => {
  rngSeed = (rngSeed * 16807) % 2147483647
  return (rngSeed - 1) / 2147483646
}
const STARS = Array.from({ length: 95 }, (_, i) => ({
  id: i,
  x: random() * 100,
  y: random() * 100,
  size: 1 + random() * 2.6,
  duration: 2 + random() * 4,
  delay: -random() * 7,
}))

// A heart-shaped canopy, built from tiny SVG blossoms — no image assets needed.
const COLORS = ['#f68cbd', '#ffa0c3', '#e87fae', '#f6b2ce', '#d8699d', '#ffd0da', '#ffa566']
const BLOSSOMS = Array.from({ length: 135 }, (_, i) => {
  const t = (i / 135) * Math.PI * 2
  const outlineX = 16 * Math.pow(Math.sin(t), 3)
  const outlineY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  const fill = 0.24 + (((i * 37) % 83) / 83) * 0.76
  return {
    id: i,
    x: 300 + outlineX * 11.5 * fill,
    y: 190 - outlineY * 10.4 * fill,
    size: 10 + ((i * 13) % 12),
    color: COLORS[i % COLORS.length],
    rotate: (i * 37) % 90 - 45,
  }
})

function HeartIcon({ filled = false, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
}
function ArrowIcon({ left = false }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: left ? 'rotate(180deg)' : undefined }}><path d="M4 12h16M13 5l7 7-7 7" /></svg>
}
function MusicIcon({ enabled }) {
  return enabled
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13M9 9l12-2" /><ellipse cx="6" cy="18" rx="3" ry="2" /><ellipse cx="18" cy="16" rx="3" ry="2" /></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13M9 9l12-2" /><ellipse cx="6" cy="18" rx="3" ry="2" /><ellipse cx="18" cy="16" rx="3" ry="2" /><path d="m3 3 18 18" /></svg>
}
function SparkIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z" /></svg>
}

function useDreamMusic(enabled) {
  const audio = useRef(null)

  useEffect(() => {
    const song = new Audio('./Bulleya-Sultan.mp3')
    song.loop = true
    song.preload = 'auto'
    song.volume = 0.65
    song.muted = false
    audio.current = song

    return () => {
      song.pause()
      song.src = ''
      audio.current = null
    }
  }, [])

  useEffect(() => {
    if (!audio.current) return
    if (!enabled) audio.current.pause()
  }, [enabled])

  const play = useCallback(() => {
    if (!audio.current) return
    const song = audio.current
    song.muted = false
    song.volume = 1
    const attempt = song.play()
    if (attempt) {
      attempt.catch(error => {
        console.warn('Music could not start:', error)
        window.setTimeout(() => song.play().catch(() => {}), 150)
      })
    }
  }, [])

  return play
}

function NightSky({ light = false }) {
  return <div className={`night-sky ${light ? 'light-sky' : ''}`} aria-hidden="true">
    {STARS.map(star => <span key={star.id} className="star" style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, animationDuration: `${star.duration}s`, animationDelay: `${star.delay}s` }} />)}
    <span className="shooting-star shooting-one" /><span className="shooting-star shooting-two" />
  </div>
}

function Confetti({ pieces }) {
  return <div className="confetti-layer" aria-hidden="true">
    {pieces.map(piece => <span key={piece.id} className="confetti-piece" style={{ left: `${piece.left}%`, background: piece.color, '--drift': `${piece.drift}px`, '--spin': `${piece.spin}deg`, animationDelay: `${piece.delay}s`, animationDuration: `${piece.duration}s`, borderRadius: piece.round ? '100%' : '2px' }} />)}
  </div>
}

function HeartTree({ growth }) {
  return <svg className="heart-tree" viewBox="0 0 600 545" fill="none" role="img" aria-label={`A growing heart-shaped tree, ${growth} of 3 growth steps completed`}>
    <defs>
      <linearGradient id="trunk" x1="100" y1="250" x2="470" y2="500"><stop stopColor="#aa6877"/><stop offset="1" stopColor="#68445e"/></linearGradient>
      <radialGradient id="treeGlow"><stop stopColor="#fff" stopOpacity=".72"/><stop offset="1" stopColor="#ffc9d8" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="300" cy="255" rx="245" ry="230" fill="url(#treeGlow)" />
    <path d="M288 515C299 450 306 385 298 302C291 251 271 213 253 183M300 316C327 257 354 223 382 196M299 362C262 312 226 289 189 271M301 393C333 341 369 320 415 301M284 445C270 417 245 404 224 394" stroke="url(#trunk)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M290 488C300 422 302 367 303 308M284 391C258 357 240 347 219 340M308 363C337 326 351 319 378 306M282 299C260 269 252 256 245 237M327 272C351 257 369 242 387 225M281 263C262 249 238 238 221 212" stroke="#935268" strokeWidth="5" strokeLinecap="round" />
    {BLOSSOMS.map((petal, i) => <text key={petal.id} className={`tree-blossom ${i < growth * 45 ? 'visible' : ''}`} x={petal.x} y={petal.y} transform={`rotate(${petal.rotate} ${petal.x} ${petal.y})`} fontSize={petal.size} textAnchor="middle" fill={petal.color} style={{ transitionDelay: `${(i % 12) * 45}ms` }}>♥</text>)}
    <ellipse cx="300" cy="524" rx="190" ry="8" fill="#ddafc0" opacity=".28" />
  </svg>
}

function Cake({ lit, blown }) {
  return <div className="cake-scene" role="img" aria-label={blown ? 'The birthday cake candles have been blown out' : lit ? 'A birthday cake with five glowing candles' : 'A birthday cake with unlit candles'}>
    <div className="cake-aura" />
    <div className="cake-candles">
      {Array.from({ length: 5 }, (_, i) => <div className="candle" key={i} style={{ '--i': i }}><span className={`flame ${lit && !blown ? 'flame-on' : ''}`} /><span className="wick" /></div>)}
    </div>
    <div className="cake-layer cake-top"><span className="icing-edge" /></div>
    <div className="cake-layer cake-bottom"><span className="icing-edge" /><span className="cake-label">T ♡</span></div>
    <div className="cake-platter" />
    <div className="cake-shadow" />
  </div>
}

function RoundedButton({ children, onClick, secondary = false, disabled = false, className = '' }) {
  return <button type="button" className={`pill-button ${secondary ? 'pill-secondary' : ''} ${className}`} onClick={onClick} disabled={disabled}>{children} <ArrowIcon /></button>
}

function Intro({ next, startMusic }) {
  return <section className="scene intro-scene" aria-label="Belated birthday welcome">
    <div className="hero-copy">
      <div className="eyebrow"><span className="mini-spark">✦</span> A LITTLE UNIVERSE, FROM MAYANK, JUST FOR YOU <span className="mini-spark">✦</span></div>
      <p className="script-intro">Dear {PERSON.recipient},</p>
      <h1>Some days are <em>made</em> for magic.</h1>
      <p className="hero-description">And this belated birthday surprise is all about you. Mayank made a little something, with a whole lot of heart.</p>
      <RoundedButton onClick={() => { startMusic(); next() }}>Open your surprise, Tiya</RoundedButton>
      <p className="signed-line">handmade with ♡ by <strong>{PERSON.sender}</strong></p>
    </div>
    <div className="hero-art" aria-hidden="true">
      <div className="sun-aura" /><div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <div className="hero-photo hero-photo-back"><img src={snow} alt="" /></div>
      <div className="hero-photo hero-photo-front"><img src={saree} alt="" /><span>Mayank’s little surprise for you ✿</span></div>
      <div className="float-heart heart-one">♥</div><div className="float-heart heart-two">♡</div><div className="float-heart heart-three">♥</div>
      <div className="stamp">made by<br/><strong>Mayank</strong><br/>✳</div>
    </div>
    <div className="bottom-hint">a tiny journey through a sky full of wishes <span>✦</span></div>
  </section>
}

function Garden({ growth, grow, next }) {
  return <section className="scene garden-scene" aria-label="Grow the heart-shaped tree">
    <div className="section-copy garden-copy">
      <p className="eyebrow">CHAPTER ONE · SOMETHING IS BLOOMING</p>
      <h2>Good things <em>grow</em> when they’re made with love.</h2>
      <p>They say every little wish grows into something beautiful. Shall we grow yours?</p>
      <div className="growth-dots" aria-label={`${growth} of 3 hearts planted`}>{[1, 2, 3].map(n => <span key={n} className={growth >= n ? 'filled' : ''}>{growth >= n ? '♥' : '♡'}</span>)}</div>
      {growth < 3
        ? <button className="pill-button" onClick={grow}>Tap to send some love <HeartIcon filled size={18} /></button>
        : <><p className="success-note">Look what a little love can do. ✨</p><RoundedButton onClick={next}>Follow the starlight</RoundedButton></>}
      <p className="tiny-instruction">{growth < 3 ? `${3 - growth} little ${3 - growth === 1 ? 'wish' : 'wishes'} to go` : 'your tree is full of love'}</p>
    </div>
    <div className="tree-container"><HeartTree growth={growth} /><span className="petal petal-a">♥</span><span className="petal petal-b">♥</span><span className="petal petal-c">♥</span></div>
  </section>
}

function CakeChapter({ lit, blown, setLit, blow, next }) {
  return <section className="scene centered-scene cake-chapter" aria-label="Make a birthday wish">
    <p className="eyebrow">CHAPTER TWO · YOUR WISH IS MY COMMAND</p>
    <h2 className="center-heading">First things first... <em>cake!</em></h2>
    <p className="section-subheading">No birthday is complete without a little wish. Close your eyes and make it a good one.</p>
    <Cake lit={lit} blown={blown} />
    {!lit ? <RoundedButton onClick={() => setLit(true)}>Light the candles</RoundedButton>
      : !blown ? <RoundedButton onClick={blow}>Make a wish & blow</RoundedButton>
        : <><p className="success-note">I hope every single wish comes true. ♡</p><RoundedButton onClick={next}>There's more waiting for you</RoundedButton></>}
    <p className="tiny-instruction">{!lit ? 'tap to light up the magic' : !blown ? 'take a moment, make a wish...' : 'your wish is on its way to the stars'}</p>
  </section>
}

function BalloonChapter({ popped, pop, lastPopped, next }) {
  return <section className="scene centered-scene balloon-chapter" aria-label="Pop balloons for five birthday messages">
    <p className="eyebrow">CHAPTER THREE · A FEW WORDS FROM THE HEART</p>
    <h2 className="center-heading">Five balloons. <em>Five wishes.</em></h2>
    <p className="section-subheading">Go on, pop them. There’s a little something hidden in each one.</p>
    <div className="balloon-field">
      {BALLOONS.map((balloon, i) => <button key={i} type="button" aria-label={`Pop balloon ${i + 1}`} aria-pressed={popped.includes(i)} disabled={popped.includes(i)} onClick={() => pop(i)} className={`balloon-wrap balloon-pos-${i} ${popped.includes(i) ? 'popped' : ''}`}>
        <span className={`balloon-body balloon-${balloon.color}`}><span className="balloon-gloss" /></span>
        <span className="balloon-knot" /><span className="balloon-string" />
      </button>)}
      {lastPopped !== null && <div key={lastPopped} className="wish-note" role="status"><span>✦ wish {lastPopped + 1} ✦</span><p>{BALLOONS[lastPopped].note}</p></div>}
    </div>
    <div className="balloon-progress">{popped.length} / {BALLOONS.length} wishes discovered</div>
    {popped.length === BALLOONS.length && <RoundedButton onClick={next}>Let's make some memories</RoundedButton>}
    <p className="tiny-instruction">{popped.length < BALLOONS.length ? 'tap a floating balloon to pop it!' : 'every balloon was full of love ♡'}</p>
  </section>
}

function Gallery({ index, setIndex, next }) {
  return <section className="scene centered-scene gallery-scene" aria-label="Photo gallery of Tiya">
    <p className="eyebrow">CHAPTER FOUR · YOUR LITTLE PHOTO ALBUM</p>
    <h2 className="center-heading">A gallery of <em>you.</em></h2>
    <p className="section-subheading">Because some pictures deserve more than just a spot in a camera roll.</p>
    <div className="photo-carousel" aria-roledescription="carousel" aria-label="Four photographs of Tiya">
      {PHOTOS.map((photo, i) => {
        const relative = (i - index + PHOTOS.length) % PHOTOS.length
        const position = relative === 0 ? 'current' : relative === 1 ? 'next' : relative === PHOTOS.length - 1 ? 'previous' : 'hidden'
        return <button key={i} type="button" className={`polaroid polaroid-${position}`} aria-label={`View photo ${i + 1}: ${PHOTO_CAPTIONS[i].title}`} aria-hidden={position === 'hidden'} tabIndex={position === 'hidden' ? -1 : 0} onClick={() => setIndex(i)}>
          <img src={photo} alt={`Tiya — ${PHOTO_CAPTIONS[i].title}`} draggable="false" />
          <span>{PHOTO_CAPTIONS[i].title} ♡</span>
        </button>
      })}
    </div>
    <div className="carousel-controls">
      <button type="button" className="round-arrow" aria-label="Previous photo" onClick={() => setIndex((index + PHOTOS.length - 1) % PHOTOS.length)}><ArrowIcon left /></button>
      <div className="carousel-dots">{PHOTOS.map((_, i) => <button type="button" key={i} aria-label={`Go to photo ${i + 1}`} aria-current={index === i ? 'true' : undefined} className={index === i ? 'active' : ''} onClick={() => setIndex(i)} />)}</div>
      <button type="button" className="round-arrow" aria-label="Next photo" onClick={() => setIndex((index + 1) % PHOTOS.length)}><ArrowIcon /></button>
    </div>
    <p className="gallery-caption" aria-live="polite">{PHOTO_CAPTIONS[index].subtitle}</p>
    <RoundedButton onClick={next}>A little letter for you</RoundedButton>
  </section>
}

function LetterChapter({ opened, open, next }) {
  return <section className={`scene centered-scene letter-scene ${opened ? 'letter-open' : ''}`} aria-label="Open Mayank's belated birthday letter">
    <p className="eyebrow">CHAPTER FIVE · THE WORDS MAYANK REALLY WANTED TO SAY</p>
    <h2 className="center-heading">One last thing, <em>{PERSON.recipient}.</em></h2>
    {!opened ? <>
      <p className="section-subheading">Some things are easier to say when Mayank writes them down.</p>
      <button className="envelope-button" type="button" onClick={open} aria-label="Open the belated birthday letter from Mayank">
        <span className="envelope-shadow" /><span className="envelope-paper-peek">from Mayank, for {PERSON.recipient} ♡</span><span className="envelope-back" /><span className="envelope-flap" /><span className="envelope-front" /><span className="wax-seal">♥</span>
      </button>
      <button type="button" className="text-button" onClick={open}>tap Mayank's envelope to open your letter ↗</button>
    </> : <>
      <article className="letter-paper" aria-label="Belated birthday letter from Mayank to Tiya">
        <span className="letter-decoration">✧ &nbsp; a belated birthday note, just for you &nbsp; ✧</span>
        <h3>Dear {PERSON.recipient},</h3>
        {LETTER.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        <p className="letter-signoff">With all Mayank's heart,<br /><strong>{PERSON.sender} ♡</strong></p>
      </article>
      <RoundedButton onClick={next}>One final surprise</RoundedButton>
    </>}
  </section>
}

function Finale({ replay }) {
  return <section className="scene finale-scene" aria-label="Belated happy birthday Tiya, from Mayank">
    <div className="finale-aura" />
    <div className="finale-content">
      <div className="finale-photo"><img src={portrait} alt="A portrait of Tiya" /><span className="finale-photo-star star-a">✦</span><span className="finale-photo-star star-b">✳</span><span className="finale-photo-star star-c">♡</span></div>
      <p className="eyebrow">THE CELEBRATION MAY BE LATE, BUT MAYANK'S LOVE ISN'T</p>
      <h1>Belated Happy Birthday, <em>{PERSON.recipient}!</em></h1>
      <p className="finale-description">Mayank hopes this new chapter is filled with beautiful moments, impossible dreams coming true, and a thousand reasons to smile.</p>
      <p className="finale-handwritten">You deserve all of the magic. ✨</p>
      <div className="signature"><span>All Mayank's love,</span><strong>{PERSON.sender} ♡</strong></div>
      <button className="replay-button" type="button" onClick={replay}>↺ &nbsp; Experience Mayank's magic again</button>
    </div>
  </section>
}

function SurpriseGate({ open }) {
  return <section className="surprise-gate" aria-label="Open Mayank's surprise for Tiya">
    <NightSky light />
    <div className="gate-glow" aria-hidden="true" />
    <div className="gate-content">
      <p className="gate-eyebrow">A LITTLE WORLD, MADE WITH LOVE</p>
      <button type="button" className="gift-seal" onClick={open} aria-label="Open your surprise, Tiya">
        <span className="gift-ribbon ribbon-one" />
        <span className="gift-ribbon ribbon-two" />
        <span className="gift-heart">♥</span>
      </button>
      <h1>Something special<br />is waiting for <em>you, Tiya</em></h1>
      <p>Mayank spent <strong>48 hours</strong> turning a few quiet feelings into a tiny universe for you.</p>
      <button type="button" className="gate-open-button" onClick={open}>Open your surprise <ArrowIcon /></button>
      <span className="gate-note">made only for Tiya ♡</span>
    </div>
  </section>
}

function RomanceEffects() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: -(i * 1.23) % 12,
    duration: 9 + (i % 5) * 1.5,
    size: 8 + (i % 4) * 3,
  }))

  return <>
    <div className="romance-petals" aria-hidden="true">
      {petals.map(petal => <span key={petal.id} style={{ left: `${petal.left}%`, '--petal-size': `${petal.size}px`, animationDelay: `${petal.delay}s`, animationDuration: `${petal.duration}s` }}>♡</span>)}
    </div>
    <div className="desktop-romance-glow" aria-hidden="true" />
  </>
}

export default function App() {
  const [chapter, setChapter] = useState('surprise')
  const [musicOn, setMusicOn] = useState(true)
  const [growth, setGrowth] = useState(0)
  const [lit, setLit] = useState(false)
  const [blown, setBlown] = useState(false)
  const [popped, setPopped] = useState([])
  const [lastPopped, setLastPopped] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [letterOpened, setLetterOpened] = useState(false)

  const playMusic = useDreamMusic(musicOn)

  const chapterIndex = CHAPTERS.findIndex(([id]) => id === chapter)

  const nextChapter = () => {
    setChapter(CHAPTERS[Math.min(chapterIndex + 1, CHAPTERS.length - 1)][0])
  }

  const replay = () => {
    setChapter('surprise')
    setGrowth(0)
    setLit(false)
    setBlown(false)
    setPopped([])
    setLastPopped(null)
    setPhotoIndex(0)
    setLetterOpened(false)
  }

  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: (i * 29) % 100,
    drift: ((i * 17) % 80) - 40,
    spin: ((i * 53) % 540) - 270,
    delay: (i % 10) * 0.12,
    duration: 3 + (i % 5) * 0.35,
    round: i % 3 === 0,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <main className="app-shell">
      <RomanceEffects />
      {chapter !== 'surprise' && <NightSky light={chapter === 'intro'} />}
      {chapter !== 'surprise' && <header className="top-bar">
        <div className="brand-mark"><HeartIcon filled size={16} /> for <strong>{PERSON.recipient}</strong></div>
        <button
          type="button"
          className="sound-toggle"
          onClick={() => setMusicOn(value => { const nextValue = !value; if (nextValue) playMusic(); return nextValue })}
          aria-label={musicOn ? 'Turn off background music' : 'Turn on background music'}
          aria-pressed={musicOn}
          title={musicOn ? 'Turn music off' : 'Turn music on'}
        >
          <MusicIcon enabled={musicOn} />
          <span>{musicOn ? 'sound on' : 'sound off'}</span>
        </button>
      </header>}

      {chapter === 'intro' && <Intro next={nextChapter} startMusic={playMusic} />}
      {chapter === 'garden' && <Garden growth={growth} grow={() => setGrowth(value => Math.min(value + 1, 3))} next={nextChapter} />}
      {chapter === 'cake' && <CakeChapter lit={lit} blown={blown} setLit={setLit} blow={() => setBlown(true)} next={nextChapter} />}
      {chapter === 'balloons' && <BalloonChapter popped={popped} lastPopped={lastPopped} pop={index => { setPopped(values => values.includes(index) ? values : [...values, index]); setLastPopped(index) }} next={nextChapter} />}
      {chapter === 'gallery' && <Gallery index={photoIndex} setIndex={setPhotoIndex} next={nextChapter} />}
      {chapter === 'letter' && <LetterChapter opened={letterOpened} open={() => setLetterOpened(true)} next={nextChapter} />}
      {chapter === 'final' && <><Confetti pieces={confetti} /><Finale replay={replay} /></>}
      {chapter === 'surprise' && <SurpriseGate open={() => { playMusic(); setChapter('intro') }} />}

      {chapter !== 'intro' && chapter !== 'surprise' && (
        <nav className="chapter-nav" aria-label="Birthday surprise chapters">
          {CHAPTERS.map(([id, label], index) => (
            <button
              key={id}
              type="button"
              className={id === chapter ? 'active' : index < chapterIndex ? 'visited' : ''}
              onClick={() => setChapter(id)}
              aria-label={`Go to chapter ${index + 1}: ${label}`}
              aria-current={id === chapter ? 'step' : undefined}
            >
              <span>{index + 1}</span>
            </button>
          ))}
        </nav>
      )}
    </main>
  )
}
