//keycodeLoginUtil.js
var Router = require('./router.js');

var KEYCODE_FLAGS = {
  confirmAttempt:0,
  isConfirmed:0,
  showModal:  {show:true},
  hideModal: {show:false}
};

var AJAX_MESSAGES = {
  setPassCodeEmailSuccess: 'An email has been sent. Check your inbox it should arrive in a few moments.',
  setPassCodeEmailFail: 'There was an error processing your e-mail. Please write your code down and store in a safe place for future reference.'
}

var keyCodeLoginUtil = {
  init: function() {
    // note: please remove the following 2 lines they are for testing passcode email and login only
    // localStorage.removeItem('keycode_login');
    // localStorage.removeItem('confirmPassCode');

    keyCodeLoginUtil.isKeyCodeSet();
    keyCodeLoginUtil.attachKeyPressValueHandle();
  },
  isKeyCodeSet: function() {
    if (localStorage.getItem('keycode_login') !== null) {
      KEYCODE_FLAGS.isConfirmed = 1;
    } else {
      keyCodeLoginUtil.initKeyCode();
    }
  },
  attachKeyPressValueHandle: function() {
    $('.dials ol li').on('click', function() {
      var passcode = '';
      if ($("#passcode").val() !== "Enter passcode") {
        passcode = '' + $("#passcode").val();
      }
      //if the passcode has an id of confirm or cancel we need to route to those functions
      var _thisId = this.id;
      if (_thisId !== "clear-code" && _thisId !== "confirm-code") {
        passcode = '' + passcode + _thisId;
      }
      if (_thisId === "clear-code") {
        keyCodeLoginUtil.emptyPasscode();
        return;
      }
      if (_thisId === "confirm-code") {
        if(KEYCODE_FLAGS.isConfirmed === 1){
          keyCodeLoginUtil.validateUserKeyCode();
        }else{
        if ( KEYCODE_FLAGS.confirmAttempt === 1 ) {
          //alert( ' confirmAttempt is 1' );
          keyCodeLoginUtil.finalKeyCodeConfirmation();
          return;
        } else {
          //alert( ' keyCodeLoginUtil.confirm false' );
          keyCodeLoginUtil.confirmKeyCode();
          return;
        }
      }
      }
      keyCodeLoginUtil.emptyPasscode();
      $("#passcode").val(passcode);
    });
  },
  initKeyCode: function() {
    $('#basicModal').modal(KEYCODE_FLAGS.showModal);
  },
  confirmKeyCode: function() {
    var confirmPassCode = $("#passcode").val();
    if (confirmPassCode.length < 4 || confirmPassCode.length > 8) {
      $("#errorModal").modal(KEYCODE_FLAGS.showModal);
      $("#passcode").val('Enter passcode');
      return;
    }
    localStorage.setItem('confirmPassCode', confirmPassCode);
    keyCodeLoginUtil.emptyPasscode();
    $('#confirmModal').modal(KEYCODE_FLAGS.showModal);
    KEYCODE_FLAGS.confirmAttempt = 1;
    //check confirm w ls
    //if they are the same proceed if not we do not have a match
  },
  finalKeyCodeConfirmation: function() {
    //match current passcode val with confirm passcode
    var confirmPassCode = localStorage.getItem('confirmPassCode');
    var currentPassCode = $("#passcode").val();

    if (confirmPassCode === currentPassCode) {
      keyCodeLoginUtil.initialLoginSuccess();
    } else {
      keyCodeLoginUtil.initialLoginFail();
    }

  },
  initialLoginSuccess: function() {
    var permanentPassCode = $("#passcode").val();
    localStorage.setItem("keycode_login" , permanentPassCode);
    //open modal with option to send email with code then 
    $("#emailPasscodeModal").modal(KEYCODE_FLAGS.showModal);

    $("#sendPassCodeEmail").on('click' , function(){
      var email = $("#passCodeEmail").val();
      var data = {email:email,passcode:permanentPassCode};
      keyCodeLoginUtil.sendEmail(data);
    });

  },
  sendEmail: function(data){
    var _data = data;
    $.ajax({
      type:'post',
      url:'http://asherwebb.com:3456/passcode',
      data:_data,
      success: function(data){
            steroids.logger.log(data);
            $("#emailPasscodeModal").modal(KEYCODE_FLAGS.hideModal);
            $("#emailSuccessModal").modal(KEYCODE_FLAGS.showModal);
            $("#proceedToLogin").on( 'click' , function(){
              //route
            });

            $("#emailNetworkStatusBlurb").append( AJAX_MESSAGES.setPassCodeEmailSuccess );
            //close or adjust current modal
            //print success modal
            //take them to home.html with router
      },
      error: function(error){
        //print that there was an error sending e-mail, please write down your code and store for future use
        //take them to login
            steroids.logger.log(error);
             $("#emailPasscodeModal").modal(KEYCODE_FLAGS.hideModal);
            $("#emailSuccessModal").modal(KEYCODE_FLAGS.showModal);

            $("#emailNetworkStatusBlurb").append( AJAX_MESSAGES.setPassCodeEmailFail);
      }


    });
    //the email ajax confirm message modal contains proceedtologin btn so attach either way
              $("#proceedToLogin").on( 'click' , function(e){
                e.preventDefault();
              keyCodeLoginUtil.login();
            });

  },
  initialLoginFail: function() {
    $("#misMatchModal").modal(KEYCODE_FLAGS.showModal);
    KEYCODE_FLAGS.confirmAttempt = 0;
    keyCodeLoginUtil.emptyPasscode();
    return;
  },
  getUserKeyCode: function() {

  },
  storeKeyCode: function(keycode) {
    var _keycode = keycode;
    localStorage.setItem('keycode_login', _keycode);
  },
  validateUserKeyCode: function() {
    var passcode = localStorage.getItem('keycode_login');
    var passcodeMatch = $("#passcode").val();
    if(passcode === passcodeMatch){
      keyCodeLoginUtil.login();
      return;
    }else{
      $("#misMatchModal").modal(KEYCODE_FLAGS.showModal);
    }
    keyCodeLoginUtil.emptyPasscode();
  },
  emailUserKeycode: function() {

  },
  emptyPasscode: function(){
    $("#passcode").val('');   
  },
  fail: function() {

  },
  login: function(){
    var route = 'home.html';
    Router.newView(route);
  }
};

module.exports = keyCodeLoginUtil;