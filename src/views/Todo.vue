<template>
  <v-container>
    <v-btn to="/add" fixed dark fab bottom right color="pink">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex md-12>
        <div v-if="sortedTodos.length === 0" class="headline text-center my-12">
          <v-icon>mdi-anchor</v-icon>
          <span class="pl-2 pr-2">[タスク]は空です</span>
          <v-icon>mdi-watch</v-icon>
        </div>
        <v-card v-for="todo in sortedTodos" :key="todo.id">
          <v-card-title>{{ todo.name }}</v-card-title>
          <v-card-text>
            <v-simple-table class="todo-datails text-center">
              <tbody>
              <tr>
                <th>期限</th>
                 <td>{{ todo.deadline.format('YYYY-MM-DD HH:mm') }}</td>
                <!--<td>{{ // moment(todo.deadline).format('YYYY-MM-DD HH:mm') }}</td>-->
              </tr>
              <tr>
                <th>見積もり時間</th>
                <td>
                  <div class="estimate_time__input">
                    <span class="v-label theme--light">短い</span>
                    <v-progress-linear
                            class="estimate-time__progress-linear mx-2"
                            :value="todo.estimate"
                            height="10"
                            color="light-blue"
                            rounded
                            readonly
                    ></v-progress-linear>

                    <span class="v-label theme--light">長い</span>
                  </div>
                </td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="doneTodo(todo)">
              <v-icon>mdi-check</v-icon>
              <span class="ml-2">完了</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
  .container {
    margin-bottom: 5em;
  }
  .todo-datails tr {
    background: none !important;
  }
  .estimate_time__input {
    align-items: center;
    display: flex;
  }
  .estimate-time__progress-linear {
    flex: 1;
  }
  .estimate-time__progress-linear .v-input__slot {
    margin-bottom: 0;
  }
  .estimate-time__progress-linear .v-messages {
    display: none;
  }
</style>

<script>
  // import push from 'push.js';
  import moment from 'moment';
  // import uuid from 'uuid/v4';
  export default {
    computed: {
      fSortedTodos() {
        return this.sortedTodos
                .slice()
                .sort((todo1, todo2) => todo1.deadline.diff(todo2.deadline));
      },
    },
    data() {
      return {
        sortedTodos: [],
      };
    },
    methods: {
      removeDB: function (taskId) {
        let request = indexedDB.open('task_cabinet', 1);
        request.onsuccess = function (event) {
          const db_instance = event.target.result;
          const tx = db_instance.transaction(["task"], "readwrite");
          const store = tx.objectStore('task');
          store.delete(taskId).onsuccess = function() {
          };
        };
      },
      removeTodo(todo) {
        const idx = this.sortedTodos.findIndex(v => v.id === todo.id);
        if (idx !== undefined) {
          this.sortedTodos.splice(idx, 1);
        }
      },
      doneTodo(todo) {
        // this.$store.commit('removeTodo', todo);
        this.removeTodo(todo);
        this.removeDB(todo.id);
      },
      findRecommendedTodo() {
        const todos = this.$store.state.todos.slice();
        if (todos.length === 0) {
          return null;
        }
        const sorted = todos
                .sort((todo1, todo2) => {
                  return (todo1.deadline.diff(todo2.deadline) !== 0
                          ? todo1.deadline.diff(todo2.deadline) : todo2.estimate  - todo1.estimate);
                });
        return (Math.random()<0.5)
                ? sorted[0] : sorted[Math.floor(Math.random()*sorted.length)];
      },
      loadDB: async function (storeName, id) {
        return new Promise (
                function (resolve, reject) {
                  var request = indexedDB.open (storeName, id);
                  request.onerror = (event) => {
                    console.log (event);
                    reject ("error");
                  };
                  request.onupgradeneeded = (event) => {
                    console.log ("!!!!!!!!!!! not found")
                    console.log (event);
                    event.target.transaction.abort ();
                    reject ("not found");
                  };
                  request.onsuccess = (event) => {
                    // console.log ("loaded");
                    var  database = event.target.result;
                    // console.log (database);
                    resolve (database)
                  }
                }
        )
      },
      getAll: async function() {
        // indexedDB を開きます。
        let request = await this.loadDB ("task_cabinet");  // indexedDB.open('task_cabinet', 3);
        // console.log ('Here is the database!')
        // console.log (request);
        let tx = request.transaction (["task"], "readwrite");
        let store = tx.objectStore ("task");
        let dbarray = await store.getAll ();
        let result = new Promise ((onSuccess) => {
          // console.log ("state", dbarray.readyState)
          dbarray.onsuccess = function (e) {
            // console.log ("GET success");
            result = e.target.result;
            onSuccess (result);
          }
        });
        let result2 = await result;
        // console.log ("result2",  result2);
        // console.log ("dbarray", dbarray);
        return result2
      }
    },
    async created() {
      // console.log ("What's this?")
      let res = await this.getAll ();
      this.sortedTodos = res.map((v) => {
        return {id: v.id, name: v.name, estimate: v.estimate, deadline: moment.unix(v.deadline)}
      }).slice().sort((todo1, todo2) => todo1.deadline.diff(todo2.deadline));
    },
    mounted () {},
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
  };
</script>
