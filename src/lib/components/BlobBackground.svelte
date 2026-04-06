<div class="blob-bg" aria-hidden="true">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
</div>

<style>
.blob-bg {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
}

.blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.45;
}

.blob-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #FFB3C6 0%, #F06292 60%, transparent 100%);
    top: -180px;
    left: -120px;
    opacity: 0.3;
}

.blob-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #E0ACD5 0%, #CE93D8 60%, transparent 100%);
    top: 10%;
    right: -140px;
    opacity: 0.25;
}

.blob-3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #FFD6E0 0%, #FFB3C6 60%, transparent 100%);
    bottom: 20%;
    left: 30%;
    opacity: 0.2;
}
</style>
