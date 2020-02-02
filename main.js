class Model {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  addTodo(text) {
    const todo = {
      id: this.generateId(),
      title: text,
      complete: false
    };
    this.todos.push(todo);
    this.saveTodos();
  }

  removeTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  editTodo(id, text) {
    this.todos = this.todos.map(todo => todo.id === id ? {id: todo.id, title: text, complete: todo.complete} : todo);
    this.saveTodos();
  }

  toggleTodo(id) {
    this.todos = this.todos.map(todo => todo.id === id ? {
      id: todo.id,
      title: todo.title,
      complete: !todo.complete
    } : todo);
    this.saveTodos();
  }

  saveTodos() {
    const todos = JSON.stringify(this.todos);
    localStorage.setItem('todos', todos);
  }

}

class View {
  constructor(model) {
    this.model = model;

    this.app = document.getElementById('app');

    this.title = this.createElement('h1', 'title');
    this.title.textContent = 'Todo List App';

    this.form = this.createElement('form', 'form');
    this.input = this.createElement('input', 'form-control');
    this.input.placeholder = 'Write todo...';
    this.addBtn = this.createElement('button', 'btn btn-primary');
    this.addBtn.textContent = 'Add todo';
    this.form.append(this.input);
    this.form.append(this.addBtn);

    this.todos = this.createElement('ul', 'list-group');

    this.app.append(this.title);
    this.app.append(this.form);
    this.app.append(this.todos);

  }

  createElement(element, classes) {
    const el = document.createElement(element);
    let classesArr;
    if (classes) {
      classesArr = classes.split(' ');
      classesArr.forEach(className => el.classList.add(className))
    }
    return el;
  }

  displayTodos(todos) {
    todos.forEach(todo => this.createTodo(todo));
  }

  createTodo(todo) {
    const todoEl = this.createElement('li', 'list-group-item');
    const text = this.createElement('span', 'text');
    const toggleBtn = this.createElement('div', 'btn-round toggle');
    const removeBtn = this.createElement('div', 'btn-round remove');

    removeBtn.addEventListener('click', (e) => this.removeTodo(e.currentTarget));
    toggleBtn.addEventListener('click', (e) => this.toggleTodo(e.currentTarget));
    text.addEventListener('focusout', (e) => this.editTodo(e.currentTarget));

    text.textContent = todo.title;

    if (!todo.complete) {
      text.setAttribute('contenteditable', !todo.complete)
    }

    todoEl.id = todo.id;
    todoEl.append(toggleBtn);
    todoEl.append(text);
    todoEl.append(removeBtn);

    if (todo.complete) {
      todoEl.classList.add('complete');
    }

    this.todos.append(todoEl);
  }

  removeTodo(target) {
    const todoElement = target.parentElement;
    const id = todoElement.id;

    todoElement.remove();
    this.model.removeTodo(id);
  }

  toggleTodo(target) {
    const todoElement = target.parentElement;
    const id = todoElement.id;
    const text = todoElement.querySelector('.text');
    const isEditable = text.getAttribute('contenteditable');

    todoElement.classList.toggle('complete');
    text.setAttribute('contenteditable', isEditable !== 'true');
    this.model.toggleTodo(id);
  }

  editTodo(target) {
    const todoElement = target.parentElement;
    const id = todoElement.id;
    const text = target.textContent;

    this.model.editTodo(id, text);
  }

}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.displayTodos(this.model.todos);
    this.addTodoBtnListener(this.view.addBtn);
  }

  displayTodos(todos) {
    this.view.displayTodos(todos);
  }

  addTodoBtnListener(btn) {
    btn.addEventListener('click', (e) => {
      const text = this.view.input.value;
      this.view.input.value = '';
      e.preventDefault();
      if (text) {
        this.model.addTodo(text);
        this.view.createTodo(this.model.todos[this.model.todos.length - 1]);
      }
    })

  }

}

model = new Model();
const app = new Controller(model, new View(model));