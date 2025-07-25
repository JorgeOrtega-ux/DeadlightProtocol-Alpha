<div class="module-overlay disabled">
    <div class="menu-overlay">
        <div class="pill-container">
            <div class="drag-handle"></div>
        </div>
        <div class="menu-overlay-top">
            <div class="menu-overlay-input">
                <input type="text" id="video-url-input" placeholder="Pega la URL del video aquí...">
            </div>
        </div>
        <div class="menu-overlay-center">
            <div id="video-processing-message" class="menu-overlay-message disabled">
                <div class="loader-spinner"></div>
                <span>Procesando, por favor espera...</span>
            </div>
            <div id="video-error-message" class="menu-overlay-message error disabled">
                <span></span>
            </div>
            <div class="menu-overlay-layout disabled" id="video-card-layout">
                <div class="video-thumbnail">
                    <img src="" alt="Video Thumbnail" id="video-thumbnail-img">
                </div>
                <div class="video-info">
                    <h3 class="video-title" id="video-title-text"></h3>
                    <p class="video-description" id="video-description-text"></p>
                </div>
                <div class="quality-selector-content">
                    <div class="quality-selector" data-action="toggleStudio">
                        <div class="quality-selector-icon">
                            <span class="material-symbols-rounded">hd</span>
                        </div>
                        <div class="quality-selector-text">1080p</div>
                        <div class="quality-selector-icon">
                            <span class="material-symbols-rounded">arrow_drop_down</span>
                        </div>
                    </div>
                    <div class="module-studio disabled">
                        <div class="menu-studio">
                            <div class="pill-container">
                                <div class="drag-handle"></div>
                            </div>
                            <div class="menu-list" id="quality-options-list">
                                <div class="menu-link" data-quality="1080p">
                                    <div class="menu-link-icon"><span class="material-symbols-rounded">hd</span></div>
                                    <div class="menu-link-text">1080p</div>
                                </div>
                                <div class="menu-link" data-quality="720p">
                                    <div class="menu-link-icon"><span class="material-symbols-rounded">720p</span></div>
                                    <div class="menu-link-text">720p</div>
                                </div>
                                <div class="menu-link" data-quality="480p">
                                    <div class="menu-link-icon"><span class="material-symbols-rounded">480p</span></div>
                                    <div class="menu-link-text">480p</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="download-button" id="download-video-button">Descargar</button>
            </div>
        </div>
        <div class="menu-overlay-bottom">
            <button id="search-video-button">Buscar contenido</button>
        </div>
    </div>
</div>