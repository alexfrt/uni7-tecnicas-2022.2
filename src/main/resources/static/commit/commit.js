const baseUrl = 'http://localhost:8080';

const commitsEndpoint = baseUrl + '/api/commits';
const commitItemEndpoint = baseUrl + '/commit_item.html';
const commitItemGroupEndpoint = baseUrl + '/commit_item_group.html';

window.onload = function getBody() {
    carregarCommits();
}

function carregarCommits() {
    let htmlItemGroup;
    fetch(commitItemGroupEndpoint)
        .then((response) => response.text())
        .then((html) => {
            htmlItemGroup = html;
        });

    let htmlItem;
    fetch(commitItemEndpoint)
        .then((response) => response.text())
        .then((html) =>{
            htmlItem = html;
        });

    fetch(commitsEndpoint)
        .then((response) => response.json())
        .then((data) => {
            if(data) {

                for(const [key, value] of Object.entries(data))
                {
                    let timeline = document.getElementById('timeline-content-commits');
                    let parser = new DOMParser();

                    const docCommitGroup = parser.parseFromString(htmlItemGroup, "text/html");

                    docCommitGroup.getElementById('data-commit').textContent = 'Commits on ' + formatarData(Date.parse(key));

                    const commitItemDom = docCommitGroup.getElementById('commit-item');

                    for(let commitItem of value)
                    {
                        let docCommitItem = parser.parseFromString(htmlItem, "text/html");

                        docCommitItem.getElementById('nome-commit').textContent = commitItem.autor.nome;
                        docCommitItem.getElementById('periodo-commit').textContent = commitItem.intervaloCommit;
                        docCommitItem.getElementById('mensagem-commit').textContent = commitItem.mensagem;
                        docCommitItem.getElementById('sha-commit').textContent = commitItem.codigoAbreviado;

                        commitItemDom.appendChild(docCommitItem.body);
                    }

                    timeline.appendChild(docCommitGroup.body);
                }
            }
        });
}

function formatarData(data)
{
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(data);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(data);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(data);

    return `${mo}. ${da}, ${ye}`;
}
function sendJSON(){

    let autor = document.querySelector('#username');
    let mensagem = document.querySelector('#msg');

    let xhr = new XMLHttpRequest();
    let url = "api/commits";

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            result.innerHTML = this.responseText;

        }
    };

    var data = JSON.stringify({ "autor": autor.value, "mensagem": mensagem.value });
    console.log(data);

    xhr.send(data);
}