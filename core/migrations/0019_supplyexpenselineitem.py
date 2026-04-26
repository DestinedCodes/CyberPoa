from django.db import migrations, models
import django.db.models.deletion


def create_line_items_for_existing_supply_expenses(apps, schema_editor):
    SupplyExpense = apps.get_model('core', 'SupplyExpense')
    SupplyExpenseLineItem = apps.get_model('core', 'SupplyExpenseLineItem')

    for expense in SupplyExpense.objects.all():
        has_items = SupplyExpenseLineItem.objects.filter(supply_expense=expense).exists()
        if has_items:
            continue

        item_name = expense.item_name or 'Supplies'
        SupplyExpenseLineItem.objects.create(
            supply_expense=expense,
            item_name=item_name,
            description=expense.description or '',
            quantity=expense.quantity,
            unit_price=expense.unit_price,
            line_total=expense.amount,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_merge_0012_transaction_created_by_0017_activitylog_updates'),
    ]

    operations = [
        migrations.CreateModel(
            name='SupplyExpenseLineItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=255, verbose_name='Item Name')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('quantity', models.DecimalField(decimal_places=2, default=1, max_digits=10, verbose_name='Quantity')),
                ('unit_price', models.DecimalField(decimal_places=2, default=0, max_digits=12, verbose_name='Unit Price')),
                ('line_total', models.DecimalField(blank=True, decimal_places=2, max_digits=12, verbose_name='Line Total')),
                ('supply_expense', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='core.supplyexpense')),
            ],
            options={
                'verbose_name': 'Supply Expense Line Item',
                'verbose_name_plural': 'Supply Expense Line Items',
                'ordering': ['id'],
            },
        ),
        migrations.RunPython(create_line_items_for_existing_supply_expenses, migrations.RunPython.noop),
    ]
