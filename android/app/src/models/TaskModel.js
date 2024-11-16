import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';

class Task extends Model {
  static table = 'tasks';

  @field('title') title;
  @field('subtitle') subtitle;
  @date('created_at') createdAt;
}

export default Task;
