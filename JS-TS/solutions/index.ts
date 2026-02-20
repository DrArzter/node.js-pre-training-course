#!/usr/bin/env ts-node
import { ToDoManager } from './todo-manager';

const manager = new ToDoManager();
const [cmd, ...args] = process.argv.slice(2);

async function main() {
  switch (cmd) {
    case 'init':
      await manager.init();
      console.log('Seeded demo data.');
      break;

    case 'add':
      await manager.add(args[0], args[1]);
      console.log(`Added: "${args[0]}"`);
      break;

    case 'complete':
      await manager.complete(Number(args[0]));
      console.log(`Toggled status for id ${args[0]}`);
      break;

    case 'list':
      const todos = await manager.list();
      todos.forEach(t => console.log(`[${t.id}] ${t.status}\t${t.title}`));
      break;

    default:
      console.log('Usage: ts-node index.ts <init|add|complete|list> [args...]');
  }
}

main().catch(console.error);
