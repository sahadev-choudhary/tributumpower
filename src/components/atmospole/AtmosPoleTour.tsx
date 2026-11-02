'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeContext';
import './atmospole.css';

interface AtmosPoleTourProps {
  theme?: 'dark' | 'light' | string;
}

export default function AtmosPoleTour({ theme: propTheme }: AtmosPoleTourProps) {
  const { theme: contextTheme } = useTheme();
  const theme = propTheme || contextTheme;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let isMounted = true;

    async function loadEngine() {
      try {
        const { initAtmosPole } = await import('./atmospole-engine.js');
        if (isMounted && rootRef.current) {
          cleanup = initAtmosPole(rootRef.current, { theme });
        }
      } catch (err) {
        console.error('Failed to initialize AtmosPole 3D Tour:', err);
      }
    }

    loadEngine();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [theme]);

  return (
    <div className="atmospole" ref={rootRef} id="features" data-ap-theme={theme}>
      <div id="atmospole" className="relative -top-20 pointer-events-none" />
      <header className="intro">
        <h1>
          Atmos<span>POLE</span>™
        </h1>
        <p>A smart street pole that measures, cleans and reports the air around it — powered by the sun.</p>
        <div className="hint">Scroll to explore ↓</div>
      </header>

      <div className="tour" id="ap-tour">
        <div className="stage">
          <canvas className="gl" id="ap-gl"></canvas>
          <div className="loading" id="ap-loading">
            LOADING 3D…
          </div>
          <svg className="links" id="ap-links"></svg>
          <div className="labels" id="ap-labels"></div>

          <div className="cards">
            <div className="card">
              <div className="n">01 — OVERVIEW</div>
              <h2>Meet AtmosPOLE</h2>
              <p>
                One pole. Clean energy, smart sensing, active mist scrubbing and live public displays — all in a single
                street-side unit.
              </p>
            </div>
            <div className="card">
              <div className="n">02 — POWER</div>
              <h2>Solar Panel</h2>
              <p>The top-mounted solar panel powers the pole's sensors, displays and lights, cutting grid dependency.</p>
              <ul>
                <li>Self-powered daytime operation</li>
                <li>Mounted at the crown for clear sun exposure</li>
                <li>Tilted to face the sun</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">03 — VISION</div>
              <h2>Smart Camera</h2>
              <p>
                A centrally mounted surveillance camera watches over the street, adding safety and monitoring to every pole.
              </p>
              <ul>
                <li>Wide-angle street coverage</li>
                <li>Protected, weather-sealed housing</li>
                <li>Ready for traffic &amp; safety analytics</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">04 — LIGHT</div>
              <h2>Twin LED Street Lights</h2>
              <p>Two LED heads on side arms light the road and footpath — replacing a conventional street light.</p>
              <ul>
                <li>Dual high-efficiency LED heads</li>
                <li>Wide road &amp; footpath spread</li>
                <li>Solar-backed operation</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">05 — PURIFY</div>
              <h2>Mist Scrubbing — Live</h2>
              <p>
                Nozzles on both sides release a fine water mist that captures PM2.5 and PM10 particles and settles them out of
                the breathing zone.
              </p>
              <ul>
                <li>Five nozzle levels on each side</li>
                <li>Fine mist curtain around the pole</li>
                <li>Targets roadside dust &amp; smoke</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">06 — MEASURE</div>
              <h2>Ambient Air Quality</h2>
              <p>
                The top screen shows the air around the pole <b className="before">before</b> treatment — live PM10, PM2.5 and
                a plain-language health status.
              </p>
              <ul>
                <li>Real-time PM10 &amp; PM2.5</li>
                <li>Instant health status for passers-by</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">07 — PROVE</div>
              <h2>Treated Air Quality</h2>
              <p>
                The second screen shows the air <b className="after">after</b> mist scrubbing, total air cleaned in the last 24
                hours, and the Air Pulse™ Index.
              </p>
              <ul>
                <li>Before vs after, side by side</li>
                <li>Live 24-hour cleaned-air counter</li>
                <li>Air Pulse™ Index at a glance</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">08 — REVENUE</div>
              <h2>Digital Ad Display</h2>
              <p>
                An eye-level digital screen rotates ads for drivers and pedestrians — turning every pole into a revenue-generating
                media point.
              </p>
              <ul>
                <li>Rotating multi-brand campaigns</li>
                <li>Eye-level for traffic &amp; footfall</li>
                <li>Funds operation &amp; maintenance</li>
              </ul>
            </div>
            <div className="card">
              <div className="n">09 — COMPLETE</div>
              <h2>The Full Pole</h2>
              <p>Power, vision, light, purification, information and advertising — engineered as one. By Tributum Power.</p>
            </div>
            <div className="card">
              <div className="n">10 — MODULES</div>
              <h2>Built in Sections</h2>
              <p>
                Each part of the pole is its own section — solar crown, light &amp; camera head, mist cap, nozzle banks, display
                stack and ad screen.
              </p>
            </div>
          </div>
          <div className="dots" id="ap-dots"></div>
        </div>
        <div className="steps" id="ap-steps"></div>
      </div>
    </div>
  );
}
