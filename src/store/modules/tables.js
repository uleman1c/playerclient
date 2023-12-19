const tasks = { 
    name: 'tasks',
    fields: ['id', 'date', 'number',
        { name: 'name', type: 'text', alias: 'Наименование' }, 
        { name: 'description', type: 'text', alias: 'Описание' }, 
        'configuration_id', 
        { name: 'priority_id', type: 'ref', alias: 'Приоритет', table: 'priorities' }, 
        'execute_date_plan', 'execute_date_fact',  
        { name: 'author_id', type: 'ref', alias: 'Автор', table: 'users' }, 
        { name: 'project_id', type: 'ref', alias: 'Проект', table: 'projects' }, 
        'hours_number', 
        { name:'executed', type: 'boolean', alias: 'Выполнено' },
        { name:'paused', type: 'boolean', alias: 'Приостановлено' },
        { name:'stoped', type: 'boolean', alias: 'Прекращено' },
     ], 
    joins: [ 
        { field: 'configurations.name as configuration', table: 'left join configurations on tasks.configuration_id = configurations.id' }, 
        { field: [ 'priorities.name as priority', 'priorities.color as priority_color' ], table: 'left join priorities on tasks.priority_id = priorities.id' }, 
        { field: 'users.name as author', table: 'left join users on tasks.author_id = users.id' }, 
        { field: 'projects.name as project', table: 'left join projects on tasks.project_id = projects.id' },
        { 
            field: 'isnull(task_comments.comment_number, 0) as comment_number', 
            table: 'left join (select task_id, sum(case when read_task_comments.comment_id is null then 1 else 0 end) as comment_number '
                    + 'from task_comments ' 
                    + 'left join (select * from read_task_comments) read_task_comments on task_comments.id = read_task_comments.comment_id '
                    + 'where author_id != @user_id '
                + 'group by task_id) as task_comments on tasks.id = task_comments.task_id ' 
        },
        { field:'object_history.number as object_history_number', table:'left join (select object_id, object_type, sum(1) as number from object_history group by object_id, object_type) as object_history on tasks.id = object_history.object_id and object_history.object_type = \'tasks\' ' }, 
        { field:'file_owners.number as file_number', table:'left join (select owner_name, owner_id, sum(1) as number from file_owners group by owner_name, owner_id) as file_owners on tasks.id = file_owners.owner_id and file_owners.owner_name = \'tasks\' ' } 
    ] 
}

const task_comments = { 
    name: 'task_comments',
    fields: ['id', 'date', 
        'task_id', 'comment', 'author_id', 'to_comment_id'], 
    joins: [ 
        { field: 'users.name as author', table: 'left join users on task_comments.author_id = users.id' }, 
        { field: 'task_comments_to.comment as comment_to', table: 'left join task_comments as task_comments_to on task_comments.to_comment_id = task_comments_to.id' }, 
        { field: [ 'read_task_comments.comment_id as read_comment', 'read_task_comments.date as read_comment_date' ], 
            table: 'left join (select date, comment_id from read_task_comments where user_id = @user_id) as read_task_comments on read_task_comments.comment_id = task_comments.id' }, 
    ] 
}

const read_task_comments = { 
    name: 'read_task_comments',
    fields: [ 'id', 'date', 'comment_id', 'user_id' ], 
    joins: [ 
        { field: 'users.name as user', table: 'left join users on read_task_comments.user_id = users.id' } 
    ] 
}

const projects = {
    name: 'projects',
    fields: ['id', 'name', 'comment']
}

const priorities = {
    name: 'priorities',
    fields: ['id', 'name', 'comment', 'color']
}

const configurations = {
    name: 'configurations',
    fields: ['id', 'name', 'comment', 'project_id']
}

const files = {
    name: 'files',
    fields: ['id', 'name', 'ext', 'description', 'style'],
    joins: [ 
        { field: 'users.name as author', table: 'left join users on files.author_id = users.id' }
    ] 
}

const route_journal = {
    name: 'route_journal',
    fields: ['id', 'date', 'ip', '_from', '_to', 'user_id'],
    joins: [ 
        { field: 'users.name as author', table: 'left join users on files.user_id = users.id' }
    ] 
}

const file_versions = {
    name: 'file_versions',
    fields: ['id', 'file_id', 'number', 'comment', 'date', 'is_deleted', 'author_id'],
    joins: [ 
        { field: 'users.name as author', table: 'left join users on files.author_id = users.id' }
    ] 
}

const file_owners = {
    name: 'file_owners',
    fields: ['id', 'file_id', 'owner_name', 'owner_id', 'comment', 'date', 'is_deleted', 'author_id'],
    joins: [ 
        { field: 'users.name as author', table: 'left join users on file_owners.author_id = users.id' },
        { field: [ 'files.name as name', 'files.ext as ext', 'files.size as size' ], table: 'inner join files on file_owners.file_id = files.id' }
    ] 
}

const object_history = {
    name: 'object_history',
    fields: [ 'id', 'date', 'version_number', 'object_type', 'object_id', 'object_data', 'author_id' ],
    joins: [ 
        { field: 'users.name as author', table: 'left join users on object_history.author_id = users.id' }
    ] 
}


/*

'select file_owners.owner_id, files.id, isnull(file_versions.id, files.id) as version_id, files.name, '
+ 'isnull(file_versions.ext, files.ext) as ext, files.comment, '
+ 'files.created, users.name as username, isnull(file_versions.number, 0) as number from file_owners '
+ 'inner join files on file_owners.file_id = files.id '
+ 'left join users on file_owners.user_id = users.id '
+ 'left join (select fvid.id, files.ext, file_versions.file_id, file_versions.number '
+ 'from (select file_versions.file_id, max(file_versions.number) as number from file_versions group by file_id) as file_versions '
+ '    inner join file_versions as fvid on fvid.file_id = file_versions.file_id and fvid.number = file_versions.number '
+ '    inner join files on files.id = fvid.id) as file_versions '
+ 'on files.id = file_versions.file_id '

*/

//+ 'where owner_id IN (' + '\'' + Ids.join('\',\'') + '\'' + ') '
//+ 'order by files.created')

const categories = {
    name: 'categories',
    fields: [ 'id', 'name', 'is_deleted', 'parent_id', 'sort_order', 'si_level' ]
}

const products = {
    name: 'products',
    fields: [ 'id', 'name', 'is_deleted', 'full_name' ]
}

const productsByCategories = {
    name: 'products',
    fields: [ 'id', 'name', 'is_deleted', 'full_name' ],
    joins: [
        {
            field: [ 'product_categories.category_id' ],
            table: ' inner join product_categories on product_categories.product_id = products.id ' 
        }
    ]
}

const main_menu = {
    name: 'main_menu',
    fields: [ 'id', 'name', 'is_deleted', 'parent_id', 'sort_order', 'type', 'navigation_id' ],
    joins: [ 
        {
            field: [ 'navigation.url' ],
            table: ' left join navigation on navigation.id = navigation_id ' 
        }
    ]
}

const navigation = {
    name: 'navigation',
    fields: [ 'id', 'name', 'is_deleted', 'url', 'comment' ]
}

const users = {
    name: 'users',
    fields: [ 'id', 'name', 'password', 'version', 'comment', 'first_name', 'last_name', 'phone', 'email_confirmed' ]
}


export default {

    tasks, task_comments, read_task_comments,
    projects,
    priorities,
    configurations,

    files, file_versions, file_owners,
    object_history, users, route_journal,

    products, productsByCategories,

    categories, main_menu, navigation

}