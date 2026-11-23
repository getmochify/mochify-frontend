<div class="blob-bg" aria-hidden="true"></div>

<style>
.blob-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
        radial-gradient(ellipse 55% 40% at 5% 0%, rgba(255, 179, 198, 0.35) 0%, transparent 70%),
        radial-gradient(ellipse 45% 35% at 95% 15%, rgba(224, 172, 213, 0.28) 0%, transparent 70%),
        radial-gradient(ellipse 40% 30% at 50% 80%, rgba(255, 214, 224, 0.22) 0%, transparent 70%);
}

/* The dark-mode trial (see $lib/theme): these pastels turn to grey haze on a
   dark page, so a themed page in dark gets the dashboard's faint saturated
   pink instead. This layer sits outside `.theme-root`, hence the `:has`. */
:global(html[data-theme='dark']:has(.theme-root)) .blob-bg {
    background:
        radial-gradient(ellipse 55% 40% at 5% 0%, rgba(240, 98, 146, 0.12) 0%, transparent 70%),
        radial-gradient(ellipse 45% 35% at 95% 15%, rgba(190, 120, 180, 0.08) 0%, transparent 70%);
}

@media (max-width: 768px) {
    .blob-bg {
        background:
            radial-gradient(ellipse 55% 40% at 5% 0%, rgba(255, 179, 198, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 95% 15%, rgba(224, 172, 213, 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 50% 80%, rgba(255, 214, 224, 0.1) 0%, transparent 70%);
    }
}
</style>
