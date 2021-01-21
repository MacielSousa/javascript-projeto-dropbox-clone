class DropBoxController {

    constructor() {

        //Resgatando os elementos html da pagina;
        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.namefileEl = this.snackModalEl.querySelector(".filename");
        this.timeleftEl = this.snackModalEl.querySelector(".timeleft");

        this.initEvents();

    }

    //Metodo que controla os eventos da pagina;
    initEvents() {

        //Evento que abre pasta para fazer upload de arquivos;
        this.btnSendFileEl.addEventListener('click', event => {

            this.inputFilesEl.click();

        });

        //Evento que abre a barra de progresso de upload dos rquivos;
        this.inputFilesEl.addEventListener('change', event => {

            this.uploadTask(event.target.files);
            this.modalShow();
            this.inputFilesEl.value = '';

        });

    }

    modalShow(show = true) {

        this.snackModalEl.style.display = (show) ? 'block' : 'none';

    }

    uploadTask(files) {

        let promises = [];

        [...files].forEach(file => {

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    this.modalShow(false);

                    try {

                        resolve(JSON.parse(ajax.responseText));

                    } catch (e) {

                        this.modalShow(false);
                        reject(e);

                    }

                };

                ajax.onerror = event => {

                    this.modalShow(false);
                    reject(event);

                }

                ajax.upload.onprogress = event => {

                    this.uploadProgress(event, file);

                }

                let formData = new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now();

                ajax.send(formData);

            }));

        })

        return Promise.all(promises);

    }

    uploadProgress(event, file) {

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeleft = ((100 - porcent) * timespent) / porcent;

        this.progressBarEl.style.width = `${porcent}%`;

        this.namefileEl.innerHTML = file.name;
        this.namefileEl.innerHTML = this.formatTimeToHuman(timeleft);
    }

    formatTimeToHuman(duration) {

        let seconds = parseInt((duration / 100) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas. ${minutes} minutos e ${seconds} segundo`;
        }
        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundo`;
        }
        if (seconds > 0) {
            return `${seconds} segundo`;
        }

        return '';

    }


}