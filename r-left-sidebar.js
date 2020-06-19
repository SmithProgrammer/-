import { LitElement, css, html } from 'lit-element';

class LeftSidebar extends LitElement {

    static get properties() { return {
        icon1: {type: String},
        icon2: {type: String},
        icon3: {type: String},
        icon4: {type: String},

        icon5: {type: String},

        link1: {type: String},
        link2: {type: String},
        link3: {type: String},
        link4: {type: String}
    }}

    constructor() {
        super();

        this.link1 = "#";
        this.link2 = "#";
        this.link3 = "#";
        this.link4 = "#";

        this.icon1 = "ti-gallery";
        this.icon2 = "ti-email";
        this.icon3 = "ti-bell";
        this.icon4 = "ti-user";
        this.icon5 = 'ti-angle-down';
    }

    static get styles() {
      return css`
                :host{
                  display: grid;
                }
                .fast-nav{
                    display: none;
                    z-index: 9999;
                }
                a {
                    text-decoration: none;
                }
                @media screen and (max-width: 983px) {
                  :host{
                    padding: 0 0 0 0;
                  }
                  .wrap{
                    position: fixed;
                    display: grid;
                    z-index: 9999;
                    right: 0px;
                    left: 0px;
                    overflow: overlay;
                    margin: 0 5px 0 5px;
                    box-shadow: 0 0 7px 0px #d0d0d0;
                    border-radius: 7px 7px 0px 0px;
                  }
                  .fast-nav{
                    position: fixed;
                    background-color: white;
                    display: grid;
                    grid-template-columns:  repeat(auto-fit, minmax(20%, 1fr));
                    height: 42px;
                    align-items: center;
                    right: 0px;
                    left: 0px;
                    bottom: 0;
                  }
                  .fast-nav a{
                    display: grid;
                    justify-items: center;
                    align-items: center;
                    height: 100%;
                  }
                  r-icon{
                    display: block;
                    font-size: 15px;
                    position: relative;
                  }
                  .wrapper-data-slot {
                    overflow-y: scroll;
                    z-index: 9000;
                    background-color: white;
                    padding: 5px;
                  }
                  .count{
                    position: absolute;
                    right: -5px;
                    top: -5px;
                    font-size: 13px;
                    color: red;
                  }
                }
      `;
    }
    

    render(){
        return html`
            <div class="wrap">
                <nav class="fast-nav">
                    <a href="${this.link1}">
                        <r-icon class="${this.icon1}">
                            <span class="count">
                                <slot name="countLink1"></slot>
                            </span>
                        </r-icon>
                    </a>

                    <a href="${this.link2}">
                        <r-icon class="${this.icon2}">
                            <span class="count">
                                <slot name="countLink2"></slot>
                            </span>
                        </r-icon>
                    </a>

                    <a class="openNav">
                        <r-icon class="${this.icon5}"></r-icon>
                    </a>

                    <a href="${this.link3}">
                        <r-icon class="${this.icon3}">
                            <span class="count">
                                <slot name="countLink3"></slot>
                            </span>
                        </r-icon>
                    </a>

                    <a href="${this.link4}">
                        <r-icon class="${this.icon4}">
                            <span class="count">
                                <slot name="countLink4"></slot>
                            </span>
                        </r-icon>
                    </a>
                </nav>
                <span class="wrapper-data-slot">
                    <slot></slot>
                </span>
            </div>
        `;
    }
    firstUpdated(){
        setTimeout( () => { 
            this.bindEvents(); 
            this.iconShow(); 
        }, 300 );
    }

    bindEvents(){
        let wrap = this.shadowRoot.querySelector('.wrap'),
            wrapperDataSlot = this.shadowRoot.querySelector('.wrapper-data-slot'),
            openNav = this.shadowRoot.querySelector('.openNav'),
            navState = false, // определяем что меню в закрытом состоянии по умолчанию 
            entireMenuHeight = wrapperDataSlot.clientHeight + 42; // полная длина меню

            // по умолчанию устанавливаем максимальную высоту обёртки слота
            wrapperDataSlot.style.maxHeight = (screen.availHeight - 84 - 42) + "px";

        // по умолчанию устанавливаем высоту закрытого меню, 
        // она равна высоте экрана минус двысота быстрого меню и панели тени
        wrap.style.top = 'auto'; 
        wrap.style.bottom = (0 - wrapperDataSlot.clientHeight) + 'px'; 

        document.querySelector('body').style.overflow = 'visible';

        openNav.addEventListener('touchmove', (e) =>{
            // Получаю текущую точку соприкосновения
            let state = e.changedTouches[0].clientY;

            e.preventDefault();
            e.stopPropagation();

            //  Запрещаем открываться меню более чем на его полную длину
            if (state < (screen.availHeight - entireMenuHeight)) {
                state = (screen.availHeight - entireMenuHeight);
                wrap.style.top = state + 'px'; 
                wrap.style.bottom = 'auto';
                document.querySelector('body').style.overflow = 'hidden';
            }
            // Запрещаем открываться меню более чем на большую половину экрана
            else if (state < 84) {
                state = 84;
                wrap.style.top = state + 'px'; 
                wrap.style.bottom = 'auto';
                document.querySelector('body').style.overflow = 'hidden';
            }

            // стрелка вверх если меню открыто и отступ сверху равен состоянию, 
            // а если закрыто то стрелка вниз и выравниваем меню снизу
            if (state < (screen.availHeight - 42)) {
                this.icon5 = "ti-angle-up";
                wrap.style.top = state + 'px'; 
                wrap.style.bottom = 'auto';
                document.querySelector('body').style.overflow = 'hidden';
            } else if (state > (screen.availHeight - 42)) {
                this.icon5 = "ti-angle-down";
                wrap.style.top = 'auto'; 
                wrap.style.bottom = (0 - wrapperDataSlot.clientHeight) + 'px'; 
                state = (screen.availHeight - 43) + 'px';
                document.querySelector('body').style.overflow = 'visible';
            }
        }, false);

        openNav.addEventListener('touchend', (e) =>{
            // Получаю точку последнего соприкосновения
            let end = e.changedTouches[0].clientY;

            // если меню открыть хоть чуть чуть то открываем его полностью и изменяем иконку на открытую
            if (end < (screen.availHeight - 42)) {
                // если меню короткое то открываем его на полную высоту 
                if ( entireMenuHeight <= (screen.availHeight - 84) ) {
                    wrap.style.top = (screen.availHeight - entireMenuHeight) + 'px';
                    wrap.style.bottom = 42 +'px';
                    document.querySelector('body').style.overflow = 'hidden';
                } 
                // если длинное то открываем его на большую половину экрана 
                else {
                    wrap.style.top = 84 + 'px';
                    wrap.style.bottom = 42 +'px';
                    document.querySelector('body').style.overflow = 'hidden';
                }
                this.icon5 = "ti-angle-up";
            }
        }, false);

        openNav.addEventListener('mouseup', (e) =>{
            // если меню закрыто 
            if (navState === false) {
                // если меню короткое то открываем его на полную высоту 
                if ( entireMenuHeight < (screen.availHeight - 84) ) {
                    wrap.style.top = 'auto'; 
                    wrap.style.bottom = 42 +'px';
                } 
                // если длинное то открываем его на большую половину экрана 
                else {
                    wrap.style.top = 84 + 'px';
                    wrap.style.bottom = '42px';
                }
                this.icon5 = "ti-angle-up";
                navState = true; // определяем что меню в открытом состоянии

                document.querySelector('body').style.overflow = 'hidden';
            } 
            // если меню открыто
            else {
                this.icon5 = "ti-angle-down";
                wrap.style.top = 'auto'; 
                wrap.style.bottom = (0 - wrapperDataSlot.clientHeight) + 'px'; 
                navState = false; // определяем что меню в закрытом состоянии
                document.querySelector('body').style.overflow = 'visible';
            }
        });
    }
    
    // Скрываю ссылки с иконками если в них не передан href
    iconShow() { 
        let fastNav = this.shadowRoot.querySelectorAll('.fast-nav a'); 

        for (var i = 0; fastNav.length > i; i++) {
            let iHref = fastNav[i].getAttribute('href');

            if (iHref != "#") {
                fastNav[i].style.display = 'grid';
            } else {
                fastNav[i].style.display = 'none';
            }
        }
    }
}   

// Register the new element with the browser. 
customElements.define('r-left-sidebar', LeftSidebar);