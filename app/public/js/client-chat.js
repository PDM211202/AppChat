// yếu cầu server kết nối với client
const socket = io();

// xử lý query string
const queryString = location.search;

const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});

const { room, username } = params;

socket.emit("join room from client to server", { room, username });



document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  const acknowledgements = (errors) => {
    if (errors) {
      return alert("tin nhắn không hợp lệ");
    }
    console.log("tin nhắn đã gửi thành công");
  };
  socket.emit(
    "send message from client to server",
    messageText,
    acknowledgements
  );
});

socket.on("send message from server to client", (message) => {
  const { createAt, messageText, username } = message;

  if (username !== params.username) {
    showMessageOfOthers(username, createAt, messageText)
  } else {
    showMessageOfSender(username, createAt, messageText)
  }
});

// gui vi tri tu user den server
document.getElementById("btn-share-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("trình duyệt đang dùng không có hổ trợ tìm ví");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position : ", position);
    const { latitude, longitude } = position.coords;
    socket.emit("share location from client to server", {
      latitude,
      longitude,
    });
  });
});

// nhan data location tu server
socket.on("share location from server to client", (data) => {
  const { createAt, messageText, username } = data;
  if (username !== params.username) {
    showLocationOfOthers(username, createAt, messageText)
  } else {
    showLocationOfSender(username, createAt, messageText)
  }
});

//hien thi ten phong len man hinh
document.getElementById("app__title").innerHTML = room;

// nhận user list và hiển thị lên màn hình
socket.on("send user list from server to client", (userList) => {
  // console.log(userList)
  let content = "";
  userList.map((user) => {
    content += `
     <li class="app__item-user">
      ${user.username}
     </li>
    `;
  })
  document.getElementById("app__list-user--content").innerHTML = content;
});

// ----------------------------------------------------------------------------------------------------------------------------------------------

// hien thi tin nhan cua moi nguoi
const showMessageOfOthers = (username, createAt, messageText) => {
  const contentHtml = document.getElementById("app__messages").innerHTML;
  const messageElement = `
  <div class="message-others">
<div class="message-item">
  <div class="message__row1">
    <p class="message__name">${username}</p>
    <p class="message__date">${createAt}</p>
  </div>
  <div class="message__row2">
    <p class="message__content">
      ${messageText}
    </p>
  </div>
</div>
</div>
`;
  let contentRender = contentHtml + messageElement;

  //hien thi len man hinh
  document.getElementById("app__messages").innerHTML = contentRender;

  //clear input messages
  document.getElementById("input-messages").value = "";
}

// hien thi tin nhan cua nguoi gui
const showMessageOfSender = (username, createAt, messageText) => {
  const contentHtml = document.getElementById("app__messages").innerHTML;
    const messageElement = `
    <div class="message-card">
  <div class="message-item">
  <div class="message__row1_me">
    <p class="message__name">${username}</p>
    <p class="message__date">${createAt}</p>
  </div>
  <div class="message__row2_me">
    <p class="message__content">
      ${messageText}
    </p>
  </div>
  </div>
  </div>
  `;
    let contentRender = contentHtml + messageElement;

    //hien thi len man hinh
    document.getElementById("app__messages").innerHTML = contentRender;

    //clear input messages
    document.getElementById("input-messages").value = "";
}

// hien thi vi tri cua nguoi khac
const showLocationOfOthers = (username, createAt, messageText) => {
  const contentHtml = document.getElementById("app__messages").innerHTML;
  const messageElement = `
  <div class="message-others">
  <div class="message-item">
  <div class="message__row1">
    <p class="message__name">${username}</p>
    <p class="message__date">${createAt}</p>
  </div>
  <div class="message__row2">
    <p class="message__content">
      <a href="${messageText} target="_blank">Vị trí của ${username}</a>
    </p>
  </div>
  </div>
  </div>
  `;
  let contentRender = contentHtml + messageElement;

  //hien thi len man hinh
  document.getElementById("app__messages").innerHTML = contentRender;
}

// hien thi vi tri cua nguoi gui
const showLocationOfSender = (username, createAt, messageText) => {
  const contentHtml = document.getElementById("app__messages").innerHTML;
  const messageElement = `
  <div class="message-card" id="message-card">
  <div class="message-item">
  <div class="message__row1_me">
    <p class="message__name">${username}</p>
    <p class="message__date">${createAt}</p>
  </div>
  <div class="message__row2_me">
    <p class="message__content">
      <a href="${messageText} target="_blank">Vị trí của ${username}</a>
    </p>
  </div>
  </div>
  </div>
  `;
  let contentRender = contentHtml + messageElement;

  //hien thi len man hinh
  document.getElementById("app__messages").innerHTML = contentRender;
}

//tu dong keo xuong khi co tin nhan
const messageScroll = document.getElementById("message-card");
messageScroll.scrollTop = messageScroll.scrollHeight;