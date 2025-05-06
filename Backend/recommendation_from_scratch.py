import pandas as pd
from collections import defaultdict
from itertools import combinations

def apriori(df, min_support=0.05, use_colnames=True):
    """Implementation of Apriori algorithm to find frequent itemsets"""
    def get_support(items, transactions):
        count = sum(1 for transaction in transactions if items.issubset(transaction))
        return count / len(transactions)
    
    # Convert DataFrame to list of sets (transactions)
    transactions = []
    for _, row in df.iterrows():
        itemset = set()
        for col in df.columns:
            if row[col] == 1:
                itemset.add(col if use_colnames else col)
        transactions.append(itemset)
    
    # Find frequent 1-itemsets
    items = set()
    for transaction in transactions:
        items.update(transaction)
    
    frequent_itemsets = []
    k = 1
    current_frequent = []
    
    # Find support for 1-itemsets
    for item in items:
        support = get_support(frozenset([item]), transactions)
        if support >= min_support:
            current_frequent.append((frozenset([item]), support))
            frequent_itemsets.append((frozenset([item]), support))
    
    # Find frequent k-itemsets
    while current_frequent:
        k += 1
        current_candidates = []
        
        # Generate candidates
        for i in range(len(current_frequent)):
            for j in range(i + 1, len(current_frequent)):
                itemset1 = current_frequent[i][0]
                itemset2 = current_frequent[j][0]
                union = itemset1.union(itemset2)
                if len(union) == k:
                    current_candidates.append(union)
        
        # Find support for candidates
        current_frequent = []
        for candidate in current_candidates:
            support = get_support(candidate, transactions)
            if support >= min_support:
                current_frequent.append((candidate, support))
                frequent_itemsets.append((candidate, support))
    
    # Convert to DataFrame with proper formatting
    result = pd.DataFrame([
        (support, itemset) 
        for itemset, support in frequent_itemsets
    ], columns=['support', 'itemsets'])
    
    # Sort by support value
    result = result.sort_values('support', ascending=False).reset_index(drop=True)



    # Sort itemsets alphabetically by their first item (converted to sorted list)
    # result['sorted_items'] = result['itemsets'].apply(lambda x: sorted(list(x)))
    # result = result.sort_values(by='sorted_items').reset_index(drop=True)

    # # Optional: drop the helper column if you don’t need it
    # result.drop(columns='sorted_items', inplace=True)


    
    return result

def association_rules(frequent_itemsets, metric="confidence", min_threshold=0.8):
    """Generate association rules from frequent itemsets"""
    rules = []
    
    for _, row in frequent_itemsets.iterrows():
        itemset = row['itemsets']  # Already a frozenset
        support_itemset = row['support']
        
        if len(itemset) < 2:
            continue
            
        for i in range(1, len(itemset)):
            for antecedent in combinations(itemset, i):
                antecedent = frozenset(antecedent)
                consequent = frozenset(itemset - antecedent)
                
                # Find support for antecedent
                ant_support = frequent_itemsets[
                    frequent_itemsets['itemsets'] == antecedent
                ]['support'].iloc[0]
                
                # Find support for consequent
                cons_support = frequent_itemsets[
                    frequent_itemsets['itemsets'] == consequent
                ]['support'].iloc[0]
                
                # Calculate metrics
                confidence = support_itemset / ant_support
                lift = confidence / cons_support
                leverage = support_itemset - (ant_support * cons_support)
                conviction = (1 - cons_support) / (1 - confidence) if confidence < 1 else float('inf')
                zhangs_metric = 0.0
                if lift > 1:
                    zhangs_metric = (confidence - cons_support) / (1 - cons_support)
                elif lift < 1:
                    zhangs_metric = (confidence - cons_support) / (-cons_support)
                
                if (metric == 'confidence' and confidence >= min_threshold) or \
                   (metric == 'lift' and lift >= min_threshold):
                    rules.append({
                        'antecedents': antecedent,  # Keep as frozenset
                        'consequents': consequent,   # Keep as frozenset
                        'antecedent support': ant_support,
                        'consequent support': cons_support,
                        'support': support_itemset,
                        'confidence': confidence,
                        'lift': lift,
                        'leverage': leverage,
                        'conviction': conviction,
                        'zhangs_metric': zhangs_metric
                    })
    
    return pd.DataFrame(rules)