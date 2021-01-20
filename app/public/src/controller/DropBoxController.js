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

            this.snackModalEl.style.display = 'block';

        });

    }

    uploadTask(files) {

        let promises = [];

        [...files].forEach(file => {

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    try {

                        resolve(JSON.parse(ajax.responseText));

                    } catch (e) {

                        reject(e);

                    }

                };

                ajax.onerror = event => {

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
        this.namefileEl.innerHTML = '';

        console.log(timespent, timeleft, porcent);

    }


}