## DDD (Domain Driven Design)

### Entidade

...

### Value Object

...

## Aggregate

"Um agregado é um conjunto de objetos associados que tratamos como uma unidade para propósito de mudança de dados"

Ex:

Customer Aggregate

<!-- ------------------------------------------------------------------------ -->

Customer (Entity) <- Address (Value Object) (Consegue existir sem uma Order)

<!-- ------------------------------------------------------------------------ -->

Order Aggregate

<!-- ------------------------------------------------------------------------ -->

Order (Entity) (Não consegue existir sem um Customer)
Item (Entity) (Só existe pq a Order existe)

<!-- ------------------------------------------------------------------------ -->

## Repositories

Cada agregado tem um repositorio. Relação de um para um entre agregado e repositório