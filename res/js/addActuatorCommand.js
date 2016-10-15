$(function(){
  $(".command_reveal").hide()
  $(".command_link").click(function(){$(this).siblings(".command_reveal").toggle()})
  $(".actuatorCommand-creator").each(function(i, el){
    var actuatorCommand_creator  = new Vue({
      delimiters: ['${', '}'],
      el: el,
      data: {
        name: "",
        signal: "",
        validation_error: ""
      },
      computed: {
        valid_form: function(){
          this.validation_error = "";
          if(this.name.length < 1){
            this.validation_error += "Please enter a valid name. "
          }
          if(this.signal.length < 1){
            this.validation_error += "Please enter a valid signal. "
          }
          if(this.validation_error == ""){
            $(el).children("button").removeClass('disabled');
          }
          else{
            $(el).children("button").addClass('disabled');
          }
          console.log(this.validation_error, $(el).children("button").hasClass("disabled"))
          return (this.validation_error == "");
        },
        form_configure(){
          //Used to update this computed value with each form change.
          this.valid_form
        }
      },
      methods: {
        submit_form: function(){
          console.log("SENT")
          if(this.valid_form){
            $.post("/config/add_actuatorCommand", {
              name: this.name,
              signal: this.signal
            }).done(function(){
              location.reload()
            })
          }
          event.preventDefault()
        }
      }
    })
    console.log($(el).children("button"))
    $(el).children("button").click(actuatorCommand_creator.submit_form)
    $(el).submit(actuatorCommand_creator.submit_form)
  })
})
