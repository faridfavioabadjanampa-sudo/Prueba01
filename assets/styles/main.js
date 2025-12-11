:root{
  --green: #34A853;
  --blue: #1A73E8;
  --bg: #FFFFFF;
  --muted: #F5F5F5;
  --text: #222;
  --container: 1200px;
  --radius: 10px;
  --shadow: 0 6px 18px rgba(30,30,30,0.06);
  font-family: "Roboto", sans-serif;
}

/* Reset básico */
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  background:var(--muted);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  line-height:1.5;
}
.container{max-width:var(--container);margin:0 auto;padding:0 20px}

/* Header */
.header{background:var(--bg);border-bottom:1px solid #e6e6e6;position:sticky;top:0;z-index:40}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
.logo{font-family:"Montserrat",sans-serif;font-weight:700;font-size:20px}
.logo span{color:var(--blue);text-decoration:none}
.nav a{margin:0 14px;text-decoration:none;color:var(--text);font-weight:500}
.header-actions{display:flex;gap:10px;align-items:center}
.btn-primary{background:var(--green);color:#fff;padding:10px 16px;border-radius:12px;border:none;text-decoration:none;display:inline-block}
.btn-outline{background:#fff;border:2px solid var(--green);color:var(--green);padding:8px 12px;border-radius:10px;text-decoration:none}
.menu-toggle{display:none;background:none;border:0;font-size:20px}
.logo-img {
  height: 42px;
  width: auto;
  display: block;
}
.btn-outline {
  display: inline-block;
  padding: 10px 18px;
  border: 2px solid var(--blue);
  color: var(--blue);
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
  background: transparent;
}

.btn-outline:hover {
  background: var(--blue);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.25);
}

.btn-outline:active {
  transform: scale(0.98);
  box-shadow: none;
}

/* HERO */
.hero{background:var(--bg);padding:64px 0}
.hero-inner{display:flex;gap:30px;align-items:center}
.hero-copy h1{font-family:"Montserrat",sans-serif;font-size:40px;margin:0 0 12px}
.lead{color:#555;margin-bottom:18px}
.hero-actions{display:flex;gap:12px;margin-bottom:12px}
.hero-features{display:flex;gap:12px;margin:8px 0;padding:0;list-style:none}
.hero-features li{background:#f0fbf4;padding:8px 12px;border-radius:999px;font-size:14px;color:var(--green)}
.hero-image img{width:520px;max-width:100%;border-radius:12px}

/* HOW IT WORKS */
.how-it-works{padding:60px 0;background:var(--muted)}
.how-it-works h2{text-align:center;font-family:"Montserrat",sans-serif}
.sub{text-align:center;color:#666;margin-bottom:24px}
.cards-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:start}
.step{background:#fff;padding:22px;border-radius:12px;box-shadow:var(--shadow);text-align:center}
.step-icon{width:64px;height:64px;margin-bottom:12px}

/* OPORTUNIDADES */
.section-alt{background:#fff}
.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.cards{display:flex;gap:24px;justify-content:center}
.cards-3 .card{width:320px;background:#fff;border-radius:12px;box-shadow:var(--shadow);overflow:hidden}
.card-img{width:100%;height:160px;object-fit:cover;display:block}
.card-body{padding:16px}
.card-body h3{color:var(--blue);margin:0}
.muted{color:#666;font-size:14px}
.card-actions{margin-top:12px}

/* TESTIMONIOS */
.testimonios{padding:60px 0}
.carousel{display:flex;gap:18px;overflow-x:auto;padding-bottom:6px}
.testimonial{min-width:300px;background:#fff;padding:18px;border-radius:12px;box-shadow:var(--shadow)}
.test-img{width:60px;height:60px;border-radius:999px;object-fit:cover;float:left;margin-right:12px}
.blockquote{font-style:italic}

/* BENEFICIOS (accent) */
.section-accent{background:var(--blue);color:#fff;padding:60px 0}
.benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;text-align:center}
.benefit img{width:56px;margin:0 auto 8px}

/* SOBRE */
.sobre{padding:60px 0;background:var(--bg)}
.sobre-inner{display:flex;gap:24px;align-items:center}
.sobre-image img{width:420px;max-width:100%;border-radius:12px}
.sobre-copy h2{font-family:"Montserrat",sans-serif}

/* SUSCRIBETE / CONTACTO */
.suscribete{padding:40px 0;background:var(--muted);text-align:center}
.subscribe-form{display:inline-flex;gap:8px;margin-top:12px}
.subscribe-form input{padding:12px;border-radius:10px;border:1px solid #ddd;width:320px}
.contact-form .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.contact-form input,.contact-form textarea{padding:12px;border-radius:8px;border:1px solid #ddd;width:100%}

/* FOOTER */
.footer{background:#333;color:#fff;padding:36px 0;margin-top:36px}
.footer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.footer a{color:#fff;text-decoration:none}
.small-footer{background:#f7f7f7;color:#444;padding:18px}

/* PROFILE / FORMS */
.form-page{padding:40px 0}
.auth-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:40px 0}
.auth-card{background:#fff;padding:24px;border-radius:12px;box-shadow:var(--shadow)}
.profile{display:flex;gap:24px;padding:40px 0}
.profile-left{width:320px;background:#fff;padding:18px;border-radius:12px;box-shadow:var(--shadow)}
.profile-right{flex:1;background:#fff;padding:18px;border-radius:12px;box-shadow:var(--shadow)}
.avatar img{width:100%;border-radius:12px}

/* Helpers */
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* Buttons small */
.btn-secondary{background:var(--green);color:#fff;padding:8px 12px;border-radius:8px;text-decoration:none;display:inline-block}
.status{padding:4px 8px;border-radius:8px;font-weight:600}
.status.approved{background:#e6f9ef;color:var(--green)}
.status.pending{background:#fff3cc;color:#d4a017}

/* Responsive */
@media (max-width:1000px){
  .cards{flex-direction:column;align-items:center}
  .how-it-works .cards-steps{grid-template-columns:1fr}
  .benefits{grid-template-columns:repeat(2,1fr)}
  .hero-inner{flex-direction:column-reverse}
  .menu-toggle{display:block}
  .nav{display:none}
}
@media (max-width:600px){
  .container{padding:0 12px}
  .benefits{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .auth-grid{grid-template-columns:1fr}

}

