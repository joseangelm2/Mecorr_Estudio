export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div className="footer-col">
            <h3>Contacto</h3>
            <a href="mailto:contacto@mecorr.com.mx">
              <img src="/promo/icons/mail.svg" alt="Email" />
              contacto@mecorr.com.mx
            </a>
            <a href="https://api.whatsapp.com/send?phone=525579410833" target="_blank" rel="noopener noreferrer">
              <img src="/promo/icons/brand-whatsapp.svg" alt="WhatsApp" />
              +52 55 7941 0833
            </a>
            <a href="https://www.mecorr.com.mx" target="_blank" rel="noopener noreferrer">
              <img src="/promo/icons/world-www.svg" alt="Web" />
              mecorr.com.mx
            </a>
          </div>

          <div className="footer-col">
            <h3>Síguenos</h3>
            <div className="social-row">
              <a href="https://www.instagram.com/mecorr.mx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src="/promo/icons/Instagram.svg" alt="Instagram" />
              </a>
              <a href="https://www.facebook.com/mecorrmx" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src="/promo/icons/facebook.svg" alt="Facebook" />
              </a>
              <a href="https://api.whatsapp.com/send?phone=525579410833&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <img src="/promo/icons/brand-whatsapp.svg" alt="WhatsApp" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
