$(function() {
    //--------------
    // Models
    //--------------
    var Todo = Backbone.Model.extend({
      defaults: {
        title: '',
        completed: false
      },

     // url: function() {
       //   var id = this.id || '';
		 // return "/api/item/"+id;
//	  }

      initialize: function() {
          if(!this.get("title")){
              this.set({"title", this.defaults.title});
		  }
	  },

      toggle: function() {
        this.save({ "completed": !this.get("completed")});
      }
    });

    //--------------
    // Collections
    //--------------
    var TodoList = Backbone.Collection.extend({
      model: Todo,

	  url: "/api/item",

      completed: function() {
        return this.filter(function( item ) {
          return item.get('completed');
        });
      },
      remaining: function() {
        return this.without.apply( this, this.completed() );
      }      
    });

    // instance of the Collection
    var todoList = new TodoList();

    //--------------
    // Views
    //--------------
    
    // renders individual todo items list (li)
    var TodoView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#item-template').html()),

      initialize: function(){
	     _.bindAll(this, "render", "remove", "edit", "updateOnEnter");
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
		this.input = this.$('.edit input');
      },  

      events: {
        'dblclick label' : 'edit',
        'keypress .edit' : 'updateOnEnter',
        'blur .edit' : 'close',
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'destroy'
      },

      render: function(){
        $(this.el).html(this.template(this.model.toJSON()));
        this.input = this.$('.edit input');
        return this; // enable chained calls
      },

      edit: function(){
        this.$el.addClass('editing');
        this.input.focus();
      },

      close: function(){
        var value = this.input.val().trim();
        if(value) {
          this.model.save({"title": value});
        }
        this.$el.removeClass('editing');
      },

      updateOnEnter: function(event){
        if(e.which == 13){
          this.close();
        }
      },

      toggleCompleted: function(){
        this.model.toggle();
      },

      destroy: function(){
        this.model.destroy();
      }      
    });

    // renders the full list of todo items calling TodoView for each one.
    app.AppView = Backbone.View.extend({
      el: '#todoapp',

      initialize: function () {
	    _.bindAll(this, "createOnEnter", "addOne", "addAll", "render");
        this.input = this.$('#new-todo');
        app.todoList.on('add', this.addAll, this);
        app.todoList.on('reset', this.addAll, this);
        var result = app.todoList.fetch(); // Loads list from local storage
      },
      events: {
        'keypress #new-todo': 'createTodoOnEnter'
      },
      createTodoOnEnter: function(e){
        if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
          return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
      },
      addOne: function(item){
        var view = new app.TodoView({model: item});
        this.$('#todo-list').append(view.render().el);
      },
      addAll: function(){
     //   this.$('#todo-list').html(''); // clean the todo list
        // filter todo item list
        //switch(window.filter){
        //  case 'pending':
      //      _.each(app.todoList.remaining(), this.addOne);
      //      break;
     //     case 'completed':
     //       _.each(app.todoList.completed(), this.addOne);
    //        break;            
    //      default:
            app.todoList.each(this.addOne, this);
    //        break;
     //   }
      },
      newAttributes: function(){
        return {
          title: this.input.val().trim(),
          completed: false
        }
      }
    });

    //--------------
    // Routers
    //--------------
    
    app.Router = Backbone.Router.extend({
      routes: {
        '*filter' : 'setFilter'
      },
      setFilter: function(params) {
        console.log('app.router.params = ' + params);
        window.filter = params.trim() || '';
        app.todoList.trigger('reset');
      }
    });     

    //--------------
    // Initializers
    //--------------   

    app.router = new app.Router();
    Backbone.history.start();    
    app.appView = new app.AppView(); 
});
