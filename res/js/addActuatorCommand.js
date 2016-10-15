$(function(){
  var actuator_creator  = new Vue({
    delimiters: ['${', '}'],
    el: "#actuator-creator",
    data: {
      name: "",
      signal_type: "",
      outlet: undefined,
      validation_error: ""
    },
    computed: {
      valid_form: function(){
        this.validation_error = "";
        if(this.name.length < 1){
          this.validation_error += "Please enter a valid name. "
        }
        if(this.signal_type == ""){
          this.validation_error += "Please select an actuator type. "
        }
        if(this.validation_error == ""){
          $("#actuator-creator button").removeAttr('disabled');
        }
        else{
          $("#actuator-creator button").attr('disabled', 'disabled');
        }
        return (this.validation_error == "");
      },
      form_configure(formdata){
        this.valid_form
        console.log(formdata, this.type)
        if(this.signal_type != "433 MHz"){
          $("#outlet-config").hide();
        }
        else{
          $("#outlet-config").show();
        }
      }
    },
    methods: {
      submit_form: function(){
        if(this.valid_form){
          $.post("config/add_actuator", {
            name: this.name,
            signal_type: this.signal_type
          }).done(function(){
            location.reload()
          })
        }
        event.preventDefault()
      }
    }
  })
  console.log("TEST")
  $("#actuator-creator button").click(actuator_creator.submit_form)
  $("#actuator-creator form").submit(actuator_creator.submit_form)
})
