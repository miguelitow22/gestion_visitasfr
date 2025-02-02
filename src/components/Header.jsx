import React from "react";

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
          <img 
            src="https://blogger.googleusercontent.com/img/a/AVvXsEjzbjsuMrL91t0ic663D42xsPxj37DIYwj_RWwIX26JLdh7_X6iHdZmrFwSV6GaLOPC3iG-HXWLRh3fPMN9BsrXWlc8LK7JxMRF_F0oy8IgFWcSZ4sH3EWL5m4rXlHLrxsknKqOFHUrrBkLf54FwonX7NwY-HgfbMhLG3ff6SMMklkqbjd3k21zmxUTMLea=s150" 
            alt="VerifiK Logo" 
            className="logo"
          />
        <p>Esta página es para la gestión de visitas domiciliarias</p>
      </div>
    </header>
  );
}

export default Header;