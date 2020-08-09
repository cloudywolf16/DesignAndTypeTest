//--MODAL-COMPONENT-FOR-SAVING/SHARING--
function ModalComponent(outputData) {

    const rootElt = document.getElementById("root");

    createDiv().class("modal").id("myModal").parent(rootElt);
    const modal = document.getElementById("myModal");
    const modalContent = createDiv().class("modal-content").parent(modal);

    const modalHeader = createDiv().class("modal-header").parent(modalContent);
    createElement('h2', 'Canvas Captured').parent(modalHeader);
    const spanClose = createSpan().class("close").id("spanClose").parent(modalHeader);
    document.getElementById("spanClose").textContent = '×';

    const modalBody = createDiv().class("modal-body").parent(modalContent);

    const saveBtn = createButton("Download").class("modalButtons").parent(modalBody);
    saveBtn.mouseClicked(function () {
        let url = URL.createObjectURL(outputData);
        download(outputData, 'designTypeCradle.gif', 'image/gif');
        progress_ = null;
        document.getElementById("btnSave").disabled = false;
    });

    const fbShareBtn = createButton("Share on FB").class("modalButtons").parent(modalBody);
    fbShareBtn.mouseClicked(function () {
        FB.ui({
            display: 'popup',
            type: 'image/gif',
            method: 'share',
            href: URL.createObjectURL(outputData),
        }, function (response) {
            if (response && !response.error_message) {
                alert('Posting completed.');
            } else {
                alert('Error while posting.');
            }
        });
    });


    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        closeModal();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    function closeModal() {
        modal.style.display = "none";
        document.getElementById("myModal").remove();
    }

}