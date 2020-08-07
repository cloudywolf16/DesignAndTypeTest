function ModalComponent(outputData) {


    console.log(outputData);

    const rootElt = document.getElementById("root");

    createDiv().class("modal").id("myModal").parent(rootElt);
    const modal = document.getElementById("myModal");
    const modalContent = createDiv().class("modal-content").parent(modal);

    const modalHeader = createDiv().class("modal-header").parent(modalContent);
    const spanClose = createSpan().class("close").id("spanClose").parent(modalHeader);
    document.getElementById("spanClose").textContent = '&#215;';

    const modalBody = createDiv().class("modal-body").parent(modalContent);

    const saveBtn = createButton("Download").class("modalButtons").parent(modalBody);
    saveBtn.mouseClicked(function () {
        let url = URL.createObjectURL(outputData);
        download(outputData, 'designTypeCradle.gif', 'image/gif');
        progress_ = null;
        document.getElementById("btnSave").disabled = false;
    });

    const fbShareBtn = createButton("Share in FB").class("modalButtons").parent(modalBody);



    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}