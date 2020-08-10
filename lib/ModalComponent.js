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
        download(outputData, 'designTypeCradle.gif', 'image/gif');
        document.getElementById("btnSave").disabled = false;
    });

    const fbShareBtn = createButton("Share on FB").class("modalButtons").parent(modalBody);
//     fbShareBtn.mouseClicked(function () {
//         const url = URL.createObjectURL(outputData);
// //Still trying to figure out how i can upload dis blob to fb;
//         console.log(url);

//         var img = new Image();
//         img.src = url;
//         console.log(img.src);

    //     FB.api(
    //         '/me/photos',
    //         'POST',
    //         {
    //             source: url,
    //             message: 'photo description'
    //         },
    //         function (response) {
    //             if (response && !response.error_message) {
    //                 alert('Posting completed.');
    //             } else {
    //                 alert('Error while posting.');
    //             }
    //         }
    //     );

    //     FB.ui({
    //         display: 'popup',
    //         type: 'image',
    //         method: 'share',
    //         href: url,
    //     }, function (response) {
    //         if (response && !response.error_message) {
    //             alert('Posting completed.');
    //             conso
    //         } else {
    //             alert('Error while posting.');
    //         }
    //     });
    // });

    document.getElementsByClassName("modalButtons")[1].disabled = true;

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        closeModal();
    }

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