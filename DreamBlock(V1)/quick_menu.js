window.onload = function() {
  // Create a modal element (e.g., a div)
  const modal = document.createElement('div');
  modal.id = 'myModal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>DreamBlock Movement Showcase (VERY WORK IN PROGRESS!!!!!!!!!!!)</p>
      <br>
      <div class="button-container">
        <button id="closeModal">let me play it bro</button>
        <button id="closeModal">button that doesnt do anything</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Style the modal to cover the screen
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'gray';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '9999';

  // Add event listener to the close button
  document.getElementById('closeModal').onclick = function() {
    modal.style.display = 'none';
  };
}