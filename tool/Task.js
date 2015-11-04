function Task(run, interval){
  this.run = run;
  this.interval = interval;
}

Task.prototype.setInterval = function(interval){
  this.interval = interval;
};

Task.prototype.start = function(){
  var self = this;
  self.taskId = setInterval(function(){
    self.run();
  }, self.interval);
};

Task.prototype.stop = function(){
  var self = this;
  if(self.taskId){
    clearInterval(self.taskId);
  }
};

module.exports = Task;