import 'package:flutter/material.dart';
import 'package:flutter/physics.dart';
import 'dart:math' as math;

class SwipeableCard extends StatefulWidget {
  final Widget child;
  final Function(bool isRight) onSwipe;
  final Widget? leftBackground;
  final Widget? rightBackground;

  const SwipeableCard({
    super.key,
    required this.child,
    required this.onSwipe,
    this.leftBackground,
    this.rightBackground,
  });

  @override
  State<SwipeableCard> createState() => _SwipeableCardState();
}

class _SwipeableCardState extends State<SwipeableCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  Offset _dragOffset = Offset.zero;
  double _rotation = 0;
  
  // Physics constants
  static const double _swipeThreshold = 150.0;
  static const double _velocityThreshold = 500.0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
    _controller.addListener(() {
      setState(() {
        _dragOffset = Offset.lerp(Offset.zero, _dragOffset, _controller.value)!;
        _rotation = _dragOffset.dx / 1000.0; // Subtle rotation
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _runSpringAnimation(Offset target, Offset velocity) {
    final simulation = SpringSimulation(
      const SpringDescription(mass: 1, stiffness: 300, damping: 20),
      0.0,
      1.0,
      velocity.dx / 1000.0,
    );

    _controller.animateWith(simulation);
  }

  void _onPanUpdate(DragUpdateDetails details) {
    setState(() {
      _dragOffset += details.delta;
      // Rotate based on x displacement
      _rotation = _dragOffset.dx / 800.0; 
    });
  }

  void _onPanEnd(DragEndDetails details) {
    final double velocity = details.velocity.pixelsPerSecond.dx;
    
    if (_dragOffset.dx > _swipeThreshold || velocity > _velocityThreshold) {
      _swipe(true);
    } else if (_dragOffset.dx < -_swipeThreshold || velocity < -_velocityThreshold) {
      _swipe(false);
    } else {
      // Return to center with spring
      _resetPosition(details.velocity.pixelsPerSecond);
    }
  }

  void _swipe(bool isRight) {
    // Animate off screen
    final screenWidth = MediaQuery.of(context).size.width;
    final targetX = isRight ? screenWidth * 1.5 : -screenWidth * 1.5;
    
    setState(() {
      _dragOffset = Offset(targetX, _dragOffset.dy);
    });
    
    Future.delayed(const Duration(milliseconds: 200), () {
      widget.onSwipe(isRight);
    });
  }

  void _resetPosition(Offset velocity) {
    _controller.stop();
    
    final simulation = SpringSimulation(
      const SpringDescription(mass: 1, stiffness: 300, damping: 20),
      0.0,
      1.0,
      velocity.dx / 1000.0,
    );

    final startOffset = _dragOffset;
    final animation = Tween<Offset>(
      begin: startOffset,
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    ));

    _controller.addListener(() {
      if (mounted && _controller.isAnimating) {
        setState(() {
          _dragOffset = animation.value;
          _rotation = _dragOffset.dx / 800.0;
        });
      }
    });

    _controller.forward(from: 0.0);
  }

  @override
  Widget build(BuildContext context) {
    final double opacity = (1.0 - (_dragOffset.dx.abs() / 600)).clamp(0.4, 1.0);

    return Stack(
      children: [
        // Backgrounds (Hints)
        if (_dragOffset.dx > 20 && widget.rightBackground != null)
           Positioned.fill(child: Opacity(
             opacity: (_dragOffset.dx / 150).clamp(0.0, 1.0),
             child: widget.rightBackground,
           )),
        if (_dragOffset.dx < -20 && widget.leftBackground != null)
           Positioned.fill(child: Opacity(
             opacity: (-_dragOffset.dx / 150).clamp(0.0, 1.0),
             child: widget.leftBackground,
           )),
           
        // The Card
        Transform.translate(
          offset: _dragOffset,
          child: Transform.rotate(
            angle: _rotation,
            child: Opacity(
              opacity: opacity,
              child: GestureDetector(
                onPanUpdate: _onPanUpdate,
                onPanEnd: _onPanEnd,
                child: widget.child,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
